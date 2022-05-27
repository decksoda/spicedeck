# Starts Deno server
import subprocess
import os

class Plugin:
    async def _main(self):
        os.system(os.getenv("HOME") + "/homebrew/plugins/SpiceDeck/SpiceDeckServer")