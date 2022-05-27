import * as colors from "https://deno.land/std@0.139.0/fmt/colors.ts";

export default {
  log: function (text) {
    console.log(colors.bold(colors.white("INFO")) + ":", text);
  },
  warn: function (text) {
    console.log(colors.bold(colors.brightYellow("WARNING")) + ":", text);
  },
  error: function (text) {
    console.log(colors.bold(colors.brightRed("ERROR")) + ":", text);
  },
};
