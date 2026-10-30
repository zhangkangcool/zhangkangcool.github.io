







```c++
 bash
    sudo tee /usr/local/bin/teams << 'EOF'
    #!/bin/bash
    export GTK_IM_MODULE=fcitx5
    export QT_IM_MODULE=fcitx5
    export XMODIFIERS=@im=fcitx5
    exec /snap/bin/teams-for-linux "$@"
    EOF
    sudo chmod +x /usr/local/bin/teams
```

