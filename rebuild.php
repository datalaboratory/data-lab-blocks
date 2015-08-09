<?php
    shell_exec("git pull origin master");
    shell_exec("npm install");
    shell_exec("rm -rf docs");
    shell_exec("grunt docco");
