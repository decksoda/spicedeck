async function getIP() {
    const cmd = Deno.run({
        cmd: "ip -4 addr show wlan0".split(" "),
        stdout: "piped",
        stderr: "piped"
    });

    let output = await cmd.output();
    output = new TextDecoder().decode(output);

    cmd.close();

    return(output.match('(?<=inet\\s)\\d+(\\.\\d+){3}')[0])
}

export default async function(ctx) {
    
    ctx.response.headers.set("Content-Type", "text/html");
    ctx.response.body = `
    <head>
      <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    </head>
    <html>
      <title>SpiceDeck Login</title>
      <h3>SpiceDeck Desktop Spotify Login<h3>
      <h4>I'm on http://${await getIP()}:6937/main.</h4>
      To find the username, go to Account -> Account Overview.<br>
      Your password is your normal password.<br><br>
      Username: <input id="username"></input><br>
      Password: <input id="password" type="password"></input><br><br>
      <button onclick="login()">Log In to Spotify</button><br<br>
      <h4>Other Settings</h4>
      <button onclick="restartSpotify()">Restart</button><br>
      <button onclick="stopSpotify()">Stop</button><br>
      <button onclick="startSpotify()">Start</button>
    </html>
    <script>
      async function login() {
          await axios.post("/api/v1/setSpotifyConfig", {
              "username": document.getElementById("username"),
              "password": document.getElementById("password")
          });

          document.body.innerHTML = "Logged in.";
      }

      async function restartSpotify() {
        await axios.post("/api/v1/restartSpotify");
      }

      async function stopSpotify() {
        await axios.post("/api/v1/stopSpotify");
      }

      async function startSpotify() {
        await axios.post("/api/v1/startSpotify");
      }
    </script>
    `
}