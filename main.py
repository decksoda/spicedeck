# Starts Deno server
import subprocess
import os

class Plugin:
    async def _main(self):
        os.system("sudo -u deck /home/deck/homebrew/plugins/SpiceDeck/start_system.sh")