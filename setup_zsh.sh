#!/bin/bash

# setup_zsh.sh
# Script para configurar Zsh, Oh My Zsh y plugins automáticamente.
# Soporta: Debian/Ubuntu, Fedora/RHEL, Arch Linux, openSUSE.

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "\n${BLUE}>>> Iniciando configuración de Zsh...${NC}\n"

# 1. Detectar Distribución y Gestor de Paquetes
detect_distro() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$NAME
        DISTRO_ID=$ID
    else
        echo -e "${RED}No se pudo detectar la distribución. /etc/os-release no encontrado.${NC}"
        exit 1
    fi

    echo -e "${BLUE}Distribución detectada:${NC} $OS ($DISTRO_ID)"

    if [[ "$DISTRO_ID" == "nixos" ]]; then
        echo -e "${RED}Este script no soporta NixOS (como se solicitó).${NC}"
        exit 1
    fi
}

install_dependencies() {
    echo -e "${BLUE}>>> Instalando dependencias (zsh, git, curl)...${NC}"
    
    case "$DISTRO_ID" in
        ubuntu|debian|kali|pop|linuxmint)
            sudo apt update && sudo apt install -y zsh git curl
            ;;
        fedora|rhel|centos)
            sudo dnf install -y zsh git curl
            ;;
        arch|manjaro|endeavouros)
            sudo pacman -Sy --noconfirm zsh git curl
            ;;
        opensuse*|suse)
            sudo zypper install -y zsh git curl
            ;;
        *)
            echo -e "${YELLOW}Distribución no reconocida automáticamente para instalación de paquetes.${NC}"
            echo -e "Por favor, instala 'zsh', 'git' y 'curl' manualmente y vuelve a ejecutar."
            read -p "¿Continuar si ya los tienes instalados? (s/n): " confirm
            if [[ "$confirm" != "s" ]]; then exit 1; fi
            ;;
    esac
}

install_oh_my_zsh() {
    if [ -d "$HOME/.oh-my-zsh" ]; then
        echo -e "${YELLOW}Oh My Zsh ya está instalado. Saltando paso.${NC}"
    else
        echo -e "${BLUE}>>> Instalando Oh My Zsh...${NC}"
        # Usamos --unattended para que no cambie el shell inmediatamente ni pida confirmación
        sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended
    fi
}


# Lista de plugins disponibles
# Formato: "Nombre:Descripcion:RepoURL(opcional)"
AVAILABLE_PLUGINS=(
    "zsh-autosuggestions:Sugelencias de comandos basadas en historial:https://github.com/zsh-users/zsh-autosuggestions"
    "zsh-syntax-highlighting:Resaltado de sintaxis en tiempo real:https://github.com/zsh-users/zsh-syntax-highlighting"
    "zsh-completions:Autocompletado adicional::"
    "docker:Autocompletado y alias para Docker::"
    "kubectl:Autocompletado para Kubernetes::"
    "git:Alias y funciones para Git (Recomendado)::"
    "fzf:Búsqueda difusa (Fuzzy finder)::"
    "history-substring-search:Busca en el historial con flechas::"
)

# Variable global para almacenar plugins seleccionados
SELECTED_PLUGINS_NAMES=("git") # Git por defecto

select_and_install_plugins() {
    echo -e "\n${YELLOW}Selección de Plugins:${NC}"
    echo "Selecciona los plugins que deseas instlar (separados por espacio)."
    echo "Por defecto (Enter) se instalan: zsh-autosuggestions, zsh-syntax-highlighting, git"
    
    echo -e "\nOpciones disponibles:"
    local i=1
    for entry in "${AVAILABLE_PLUGINS[@]}"; do
        IFS=":" read -r name desc repo <<< "$entry"
        echo "$i) $name - $desc"
        ((i++))
    done

    read -p "Ingresa los números (ej. 1 2 4): " plugin_choices

    # Default choices if empty
    if [[ -z "$plugin_choices" ]]; then
        plugin_choices="1 2 6" # autosuggestions, syntax-highlighting, git
    fi

    echo -e "${BLUE}>>> Instalando plugins seleccionados...${NC}"
    ZSH_CUSTOM="${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}"
    
    # Reiniciar lista de seleccionados
    SELECTED_PLUGINS_NAMES=()

    for num in $plugin_choices; do
        # Ajustar indice (array es 0-indexed, input user es 1-indexed)
        idx=$((num-1))
        if [[ $idx -ge 0 && $idx -lt ${#AVAILABLE_PLUGINS[@]} ]]; then
            IFS=":" read -r name desc repo <<< "${AVAILABLE_PLUGINS[$idx]}"
            SELECTED_PLUGINS_NAMES+=("$name")
            
            # Si tiene repo URL, clonarlo
            if [[ -n "$repo" ]]; then
                if [ ! -d "$ZSH_CUSTOM/plugins/$name" ]; then
                    echo "Instalando $name..."
                    git clone "$repo" "$ZSH_CUSTOM/plugins/$name"
                else
                    echo "$name ya instalado."
                fi
            fi
        fi
    done
    
    # Uniq de plugins
    SELECTED_PLUGINS_NAMES=($(echo "${SELECTED_PLUGINS_NAMES[@]}" | tr ' ' '\n' | sort -u | tr '\n' ' '))
    echo "Plugins habilitados: ${SELECTED_PLUGINS_NAMES[*]}"
}

configure_zshrc() {
    # Esta función aplica los cambios al .zshrc (Tema y Plugins)
    local theme_name="$1"
    
    echo -e "${BLUE}>>> Actualizando .zshrc...${NC}"
    ZSHRC_FILE="$HOME/.zshrc"
    
    # Backup
    cp "$ZSHRC_FILE" "$ZSHRC_FILE.backup.$(date +%F_%T)"

    # Actualizar Tema
    if [[ -n "$theme_name" ]]; then
         sed -i 's/^ZSH_THEME=".*"/ZSH_THEME="'$theme_name'"/' "$ZSHRC_FILE"
    fi

    # Actualizar Plugins
    # Construir string de plugins: plugins=(git zsh-autosuggestions ...)
    local plugin_str="plugins=(${SELECTED_PLUGINS_NAMES[*]})"
    
    # Usamos perl para reemplazo multilinea o sed con cuidado.
    # Asumimos que plugins=(...) está en una linea o gestionamos el reemplazo simple.
    # Para robustez en este script simple, reemplazamos la línea que empiece por plugins=
    if grep -q "^plugins=" "$ZSHRC_FILE"; then
        sed -i "s/^plugins=(.*)/$plugin_str/" "$ZSHRC_FILE"
    else
        echo "$plugin_str" >> "$ZSHRC_FILE"
    fi
}

configure_theme_interactive() {
    echo -e "\n${YELLOW}Selección de Tema Visual:${NC}"
    echo "1) Powerlevel10k (Recomendado, muy bonito, pero REQUIERE Nerd Fonts)"
    echo "2) Bira (Simple, bonito, no requiere fuentes extra)"
    echo "3) Robbyrussell (Default de Oh My Zsh)"
    echo "4) Pure (Minimalista, rápido, requiere instalación manual)"
    read -p "Elige una opción (1-4): " theme_choice

    ZSHRC_FILE="$HOME/.zshrc"
    TARGET_THEME="robbyrussell" # Default fallback

    case "$theme_choice" in
        1)
            TARGET_THEME="powerlevel10k/powerlevel10k"
            ZSH_CUSTOM="${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}"
            if [ ! -d "$ZSH_CUSTOM/themes/powerlevel10k" ]; then
                git clone --depth=1 https://github.com/romkatv/powerlevel10k.git "$ZSH_CUSTOM/themes/powerlevel10k"
            fi
            echo -e "${YELLOW}IMPORTANTE: Instala una 'Nerd Font' (ej. MesloLGS NF).${NC}"
            ;;
        2)
            TARGET_THEME="bira"
            ;;
        4)
            TARGET_THEME="" # En OMZ vacío para prompt manual
            mkdir -p "$HOME/.zsh/pure"
            if [ ! -d "$HOME/.zsh/pure/pure" ]; then
                git clone https://github.com/sindresorhus/pure.git "$HOME/.zsh/pure/pure"
            fi
            # Add pure config if missing
            if ! grep -q "prompt pure" "$ZSHRC_FILE"; then
                echo -e "\n# Pure Prompt Config" >> "$ZSHRC_FILE"
                echo 'fpath+=$HOME/.zsh/pure/pure' >> "$ZSHRC_FILE"
                echo 'autoload -U promptinit; promptinit' >> "$ZSHRC_FILE"
                echo 'prompt pure' >> "$ZSHRC_FILE"
            fi
            ;;
        *)
            TARGET_THEME="robbyrussell"
            ;;
    esac
    
    configure_zshrc "$TARGET_THEME"
    
    if [[ "$theme_choice" == "1" ]]; then
         echo -e "${GREEN}Se ejecutará el asistente de p10k al iniciar zsh.${NC}"
    fi
}

reconfigure() {
    echo -e "\n${BLUE}>>> Modo de Reconfiguración <<<${NC}"
    echo "1) Reconfigurar Plugins"
    echo "2) Reconfigurar Tema"
    echo "3) Ambos"
    read -p "Opción: " reconf_opt
    
    case "$reconf_opt" in
        1)
            select_and_install_plugins
            # No cambiamos el tema, pasamos string vacio para mantener el actual si se pudiera leer,
            # pero configure_zshrc sobrescribe. Necesitamos leer el tema actual o pedirlo.
            # Simplificación: solo actualizamos plugins en el archivo.
            # Leemos el tema actual del .zshrc
            CURRENT_THEME=$(grep "^ZSH_THEME=" "$HOME/.zshrc" | cut -d'"' -f2)
            configure_zshrc "$CURRENT_THEME"
            ;;
        2)
            # Para solo tema, necesitamos mantener los plugins actuales.
            # Leemos plugins actuales
            CURRENT_PLUGINS_LINE=$(grep "^plugins=" "$HOME/.zshrc")
            # Extraer contenido entre parentesis
            PLUGINS_CONTENT=$(echo $CURRENT_PLUGINS_LINE | sed 's/plugins=(\(.*\))/\1/')
            SELECTED_PLUGINS_NAMES=($PLUGINS_CONTENT)
            configure_theme_interactive
            ;;
        *)
            select_and_install_plugins
            configure_theme_interactive
            ;;
    esac
    echo -e "${GREEN}>>> Reconfiguración completa.${NC}"
    echo "Ejecuta 'source ~/.zshrc' o reinicia la terminal."
}

# --- Ejecución Principal ---

# Si se pasa el argumento "reconfigure", entramos directo a ese modo
if [[ "$1" == "reconfigure" ]]; then
    reconfigure
    exit 0
fi

# Flujo normal de instalación
detect_distro
install_dependencies
install_oh_my_zsh
# En flujo normal, preguntamos si quiere configurar todo paso a paso
echo -e "\n${YELLOW}¿Deseas personalizar plugins y temas ahora? (s/n)${NC}"
read -p "Si respondes 'n', se instalarán los defaults. : " customize
if [[ "$customize" == "s" ]]; then
    select_and_install_plugins
    configure_theme_interactive
else
    # Defaults
    SELECTED_PLUGINS_NAMES=("git" "zsh-autosuggestions" "zsh-syntax-highlighting")
    # Instalar defaults manualmente si no se seleccionó
    install_plugins # Función legacy (la renombrare a install_default_plugins abajo o uso la logica aqui)
    # Mejor: llamamos a select_and_install_plugins con input simulado o lógica custom.
    # Por simplicidad, reinstalare los plugins básicos hardcoded aqui si elige "no"
    echo -e "${BLUE}Instalando plugins por defecto...${NC}"
    ZSH_CUSTOM="${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}"
    [ ! -d "$ZSH_CUSTOM/plugins/zsh-autosuggestions" ] && git clone https://github.com/zsh-users/zsh-autosuggestions "$ZSH_CUSTOM/plugins/zsh-autosuggestions"
    [ ! -d "$ZSH_CUSTOM/plugins/zsh-syntax-highlighting" ] && git clone https://github.com/zsh-users/zsh-syntax-highlighting.git "$ZSH_CUSTOM/plugins/zsh-syntax-highlighting"
    
    # Tema default
    configure_zshrc "robbyrussell"
fi

set_default_shell

echo -e "\n${GREEN}>>> ¡Instalación Completada! <<<${NC}"
echo -e "Puedes reconfigurar en el futuro ejecutando: ./setup_zsh.sh reconfigure"
echo -e "Por favor, cierra sesión y vuelve a entrar, o ejecuta 'zsh' ahora."


