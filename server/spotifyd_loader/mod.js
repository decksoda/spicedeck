import konsole from "./konsole.js";
import { existsSync } from "https://deno.land/std/fs/mod.ts";

/**
 * Download the source file and write it into the destination
 */
async function download(source, destination) {
  // We use browser fetch API
  const response = await fetch(source);
  const blob = await response.blob();

  // We convert the blob into a typed array
  // so we can use it to write the data into the file
  const buf = await blob.arrayBuffer();
  const data = new Uint8Array(buf);

  // We then create a new file and write into it
  const file = await Deno.create(destination);
  await Deno.writeAll(file, data);

  // We can finally close the file
  Deno.close(file.rid);
}

/**
 * Unzip the file
 */
async function unzip(filepath, dir) {
  // We execute the command
  // The function returns details about the spawned process
  const process = Deno.run({
    cmd: ["tar", "-xf", filepath, "-C", dir],
    stdout: "piped",
    stderr: "piped",
  });

  // We can access the status of the process
  const { success, code } = await process.status();

  if (!success) {
    // We retrieve the error
    const raw = await process.stderrOutput();
    const str = new TextDecoder().decode(raw);
    throw new Error(`$Command failed: code ${code}, message: ${str}`);
  } else {
    // Similarly to access the command output
    const raw = await process.output();
    const str = new TextDecoder().decode(raw);
  }
}

async function get(url) {
  const response = await fetch(url);
  const text = await response.text();
  return text;
}

export default {
  async init() {
    konsole.log("Checking for spotifyd in Documents...");
    if (!existsSync(Deno.env.get("HOME") + "/Documents/spotifyd")) {
      konsole.warn("Could not find spotifyd! Downloading...");

      let githubApi = await get(
        "https://api.github.com/repos/Spotifyd/spotifyd/releases/latest"
      );
      githubApi = JSON.parse(githubApi);

      for (let asset of githubApi.assets) {
        if (asset.name == "spotifyd-linux-full.tar.gz") {
          konsole.log("Downloading Spotify...");
          await download(asset.browser_download_url, "/tmp/spotifyd.tar.gz");
          konsole.log("Extracting...");
          await unzip(
            "/tmp/spotifyd.tar.gz",
            Deno.env.get("HOME") + "/Documents"
          );
          konsole.log("Giving permissions to executable...");

          const process = Deno.run({
            cmd: ["chmod", "+x", Deno.env.get("HOME") + "/Documents/spotifyd"],
            stdout: "piped",
            stderr: "piped",
          });

          const { success, code } = await process.status();
        }
      }
    }

    konsole.log("Spotifyd has been found. Checking for a spotifyd config...");

    if (!existsSync(Deno.env.get("HOME") + "/.config/spotifyd/spotifyd.conf")) {
      konsole.error("Cannot start! Missing config.");
    } else {
      konsole.log("Starting...");

      const process = Deno.run({
        cmd: [Deno.env.get("HOME") + "/Documents/spotifyd"],
        stdout: "piped",
        stderr: "piped",
      });

      const { success, code } = await process.status();
    }
  },
  async setupLogin(username, password) {
    konsole.log("Initializing configuration...");

    if (!existsSync(Deno.env.get("HOME") + "/.config/spotifyd")) {
        Deno.mkdir(Deno.env.get("HOME") + "/.config/spotifyd");
    }

    Deno.writeTextFile(
      Deno.env.get("HOME") + "/.config/spotifyd/spotifyd.conf",
`[global]
username = "${username}"
password = "${password}"

backend = "alsa"
device = "default"
control = "default"

mixer = "PCM"

volume_controller = "alsa"
    
bitrate = 160
initial_volume = "70"

device_type = "computer"`
    );

    konsole.log("Initialized.");
  },
  async restartSpotifyd() {
    konsole.log("Restarting Spotifyd...");

    const process = Deno.run({
      cmd: ["killall", "spotifyd"],
      stdout: "piped",
      stderr: "piped",
    });

    await process.status();

    this.init();
  },
  async stopSpotifyd() {
    konsole.log("Stopping Spotifyd...");

    const process = Deno.run({
      cmd: ["killall", "spotifyd"],
      stdout: "piped",
      stderr: "piped",
    });

    await process.status();
  },
  async startSpotifyd() {
    konsole.log("Starting Spotifyd...");
    this.init();
  }
};
