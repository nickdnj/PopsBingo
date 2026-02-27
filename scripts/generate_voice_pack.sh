#!/bin/bash

# ============================================
# Pop's Bingo - Voice Pack Generator
# ============================================
# Generates 75 placeholder bingo call audio files
# using macOS text-to-speech (Alex voice)
#
# Usage: ./scripts/generate_voice_pack.sh
# ============================================

set -e

# Configuration
VOICE="Alex"
AUDIO_DIR="$(dirname "$0")/../audio"
TEMP_DIR="/tmp/bingo_audio_temp"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🎱 Pop's Bingo Voice Pack Generator${NC}"
echo "======================================"
echo "Voice: $VOICE"
echo "Output: $AUDIO_DIR"
echo ""

# Create directories
mkdir -p "$AUDIO_DIR"
mkdir -p "$TEMP_DIR"

# Function to generate a single call
generate_call() {
    local letter=$1
    local number=$2
    local filename="${letter}${number}"
    local phrase="${letter} ${number}"
    local temp_file="${TEMP_DIR}/${filename}.aiff"
    local output_file="${AUDIO_DIR}/${filename}.wav"
    
    # Generate speech to AIFF (native macOS format)
    say -v "$VOICE" "$phrase" -o "$temp_file"
    
    # Convert AIFF to WAV for web compatibility
    afconvert -f WAVE -d LEI16 "$temp_file" "$output_file"
    
    # Clean up temp file
    rm "$temp_file"
    
    echo -e "  ${GREEN}✓${NC} ${filename}.wav - \"$phrase\""
}

# Generate B calls (1-15)
echo -e "\n${BLUE}Generating B calls (1-15)...${NC}"
for i in $(seq 1 15); do
    generate_call "B" "$i"
done

# Generate I calls (16-30)
echo -e "\n${BLUE}Generating I calls (16-30)...${NC}"
for i in $(seq 16 30); do
    generate_call "I" "$i"
done

# Generate N calls (31-45)
echo -e "\n${BLUE}Generating N calls (31-45)...${NC}"
for i in $(seq 31 45); do
    generate_call "N" "$i"
done

# Generate G calls (46-60)
echo -e "\n${BLUE}Generating G calls (46-60)...${NC}"
for i in $(seq 46 60); do
    generate_call "G" "$i"
done

# Generate O calls (61-75)
echo -e "\n${BLUE}Generating O calls (61-75)...${NC}"
for i in $(seq 61 75); do
    generate_call "O" "$i"
done

# Clean up temp directory
rmdir "$TEMP_DIR" 2>/dev/null || true

# Count files
FILE_COUNT=$(ls -1 "$AUDIO_DIR"/*.wav 2>/dev/null | wc -l | tr -d ' ')

echo ""
echo "======================================"
echo -e "${GREEN}✓ Complete!${NC} Generated $FILE_COUNT audio files"
echo "Location: $AUDIO_DIR"
echo ""
echo "To use in Pop's Bingo:"
echo "1. Open the app in your browser"
echo "2. Click 'Load Voice Pack'"
echo "3. Select the 'audio' folder"
echo ""






