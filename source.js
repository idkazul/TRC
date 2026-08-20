(function() {
    'use strict';

    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .trc-panel {
            position: fixed;
            top: 40px;
            right: 40px;
            width: 320px;
            background: #0a0a0a;
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 24px;
            padding: 24px 20px 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.02) inset;
            color: #eee;
            cursor: grab;
            transition: box-shadow 0.2s ease, transform 0.1s ease;
            will-change: transform;
            z-index: 99999;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            box-sizing: border-box;
        }
        .trc-panel * {
            box-sizing: border-box;
            user-select: none;
        }
        .trc-panel:active {
            cursor: grabbing;
            box-shadow: 0 25px 70px rgba(0, 0, 0, 0.95);
        }
        .trc-panel.dragging {
            transition: none;
        }
        .trc-panel-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 18px;
            padding-bottom: 14px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .trc-panel-title {
            font-weight: 500;
            font-size: 15px;
            letter-spacing: 0.3px;
            background: linear-gradient(135deg, #d0d0d0, #a0a0a0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .trc-panel-title i {
            font-size: 16px;
            color: #aaa;
            -webkit-text-fill-color: #aaa;
            background: none;
        }
        .trc-panel-indicator {
            display: flex;
            gap: 6px;
        }
        .trc-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #2a2a2a;
            transition: background 0.2s;
        }
        .trc-dot.active {
            background: #4caf50;
            box-shadow: 0 0 8px #4caf5070;
        }
        .trc-feature-list {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }
        .trc-feature-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 12px;
            background: rgba(255, 255, 255, 0.02);
            border-radius: 14px;
            transition: background 0.2s, border-color 0.2s;
            border: 1px solid transparent;
            cursor: default;
        }
        .trc-feature-item:hover {
            background: rgba(255, 255, 255, 0.04);
            border-color: rgba(255, 255, 255, 0.04);
        }
        .trc-feature-label {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
            font-weight: 450;
            color: #ccc;
        }
        .trc-feature-label i {
            font-size: 16px;
            width: 20px;
            text-align: center;
            opacity: 0.7;
            color: #b0b0b0;
        }
        .trc-expand-icon {
            font-size: 12px;
            margin-left: 6px;
            transition: transform 0.3s ease;
            opacity: 0.5;
            cursor: pointer;
        }
        .trc-expand-icon.open {
            transform: rotate(180deg);
        }
        .trc-toggle {
            position: relative;
            width: 40px;
            height: 22px;
            flex-shrink: 0;
            background: #2a2a2a;
            border-radius: 40px;
            transition: background 0.25s ease;
            cursor: pointer;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.4);
        }
        .trc-toggle.active {
            background: #3b8bff;
            box-shadow: 0 0 12px #3b8bff60;
        }
        .trc-toggle .knob {
            position: absolute;
            top: 2px;
            left: 2px;
            width: 18px;
            height: 18px;
            background: #f0f0f0;
            border-radius: 50%;
            transition: transform 0.25s cubic-bezier(0.34, 1.2, 0.64, 1);
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }
        .trc-toggle.active .knob {
            transform: translateX(18px);
            background: #ffffff;
        }
        .trc-slider-group {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.35s ease, opacity 0.25s ease, margin 0.3s ease;
            opacity: 0;
            margin: 0 8px 0 8px;
        }
        .trc-slider-group.open {
            max-height: 220px;
            opacity: 1;
            margin: 8px 8px 4px 8px;
        }
        .trc-slider-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 6px 4px;
            font-size: 13px;
            color: #bbb;
        }
        .trc-slider-row label {
            flex: 1;
            font-weight: 400;
            letter-spacing: 0.2px;
        }
        .trc-slider-value {
            min-width: 32px;
            text-align: right;
            font-weight: 500;
            color: #ddd;
            font-size: 13px;
            margin-right: 6px;
        }
        .trc-slider-row input[type="range"] {
            -webkit-appearance: none;
            appearance: none;
            width: 90px;
            height: 4px;
            border-radius: 4px;
            background: #3a3a3a;
            outline: none;
            transition: background 0.2s;
            flex-shrink: 0;
        }
        .trc-slider-row input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #f0f0f0;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(0,0,0,0.5);
            transition: 0.15s;
            border: 1px solid #555;
        }
        .trc-slider-row input[type="range"]::-webkit-slider-thumb:hover {
            background: #fff;
            transform: scale(1.08);
        }
        .trc-slider-row input[type="range"]::-moz-range-thumb {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #f0f0f0;
            cursor: pointer;
            border: 1px solid #555;
        }
        .trc-slider-row input[type="range"]:disabled {
            opacity: 0.3;
        }
        .trc-keybind-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 12px;
            background: rgba(255, 255, 255, 0.02);
            border-radius: 14px;
            transition: background 0.2s, border-color 0.2s;
            border: 1px solid transparent;
            margin-top: 4px;
        }
        .trc-keybind-item:hover {
            background: rgba(255, 255, 255, 0.04);
            border-color: rgba(255, 255, 255, 0.04);
        }
        .trc-keybind-label {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
            font-weight: 450;
            color: #ccc;
        }
        .trc-keybind-label i {
            font-size: 16px;
            width: 20px;
            text-align: center;
            opacity: 0.7;
            color: #b0b0b0;
        }
        .trc-keybind-box {
            background: rgba(255, 255, 255, 0.06);
            border-radius: 8px;
            padding: 4px 12px;
            font-size: 13px;
            font-weight: 500;
            letter-spacing: 0.3px;
            color: #ddd;
            border: 1px solid rgba(255, 255, 255, 0.08);
            transition: all 0.2s ease;
            cursor: pointer;
            min-width: 70px;
            text-align: center;
            font-family: 'Inter', monospace;
            position: relative;
        }
        .trc-keybind-box.recording {
            border-color: #3b8bff;
            background: rgba(59, 139, 255, 0.15);
            color: #fff;
            box-shadow: 0 0 12px rgba(59, 139, 255, 0.2);
            animation: trc-pulse-border 1s infinite;
        }
        @keyframes trc-pulse-border {
            0% { border-color: #3b8bff; box-shadow: 0 0 8px rgba(59, 139, 255, 0.2); }
            50% { border-color: #7bb3ff; box-shadow: 0 0 16px rgba(59, 139, 255, 0.4); }
            100% { border-color: #3b8bff; box-shadow: 0 0 8px rgba(59, 139, 255, 0.2); }
        }
        .trc-keybind-box .hint {
            font-size: 10px;
            opacity: 0.5;
            font-weight: 300;
            letter-spacing: 0.3px;
            margin-left: 6px;
        }
        .trc-toast-container {
            position: fixed;
            bottom: 30px;
            right: 30px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 999999;
            pointer-events: none;
            max-width: 360px;
        }
        .trc-toast {
            background: #0a0a0a;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 16px;
            padding: 14px 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.02) inset;
            color: #ddd;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 400;
            display: flex;
            align-items: center;
            gap: 12px;
            transform: translateX(calc(100% + 40px));
            opacity: 0;
            transition: transform 0.4s cubic-bezier(0.34, 1.2, 0.64, 1), opacity 0.35s ease;
            pointer-events: auto;
            backdrop-filter: blur(4px);
            border-left: 3px solid #666;
        }
        .trc-toast.show {
            transform: translateX(0);
            opacity: 1;
        }
        .trc-toast i {
            font-size: 18px;
            color: #999;
            flex-shrink: 0;
        }
        .trc-toast .toast-msg {
            flex: 1;
            line-height: 1.4;
        }
        .trc-toast .toast-close {
            cursor: pointer;
            opacity: 0.3;
            font-size: 14px;
            transition: opacity 0.2s;
            margin-left: 6px;
        }
        .trc-toast .toast-close:hover {
            opacity: 0.8;
        }
        @media (max-width: 600px) {
            .trc-panel {
                top: 20px;
                right: 20px;
                left: 20px;
                width: auto;
                padding: 20px 16px;
            }
            .trc-toast-container {
                bottom: 20px;
                right: 20px;
                left: 20px;
                max-width: none;
            }
        }
    `;
    document.head.appendChild(styleElement);

    const panelElement = document.createElement('div');
    panelElement.className = 'trc-panel';
    panelElement.id = 'trcPanel';
    panelElement.innerHTML = `
        <div class="trc-panel-header" id="trcDragHandle">
            <span class="trc-panel-title"><i class="fas fa-terminal"></i> TRC</span>
            <div class="trc-panel-indicator">
                <span class="trc-dot"></span>
                <span class="trc-dot active"></span>
                <span class="trc-dot"></span>
            </div>
        </div>
        <div class="trc-feature-list">
            <div class="trc-feature-group" id="trcAutotypeGroup">
                <div class="trc-feature-item">
                    <span class="trc-feature-label">
                        <i class="fas fa-bolt"></i> Autotype
                        <i class="fas fa-chevron-down trc-expand-icon" id="trcAutotypeExpand"></i>
                    </span>
                    <div class="trc-toggle" id="trcAutotypeToggle">
                        <span class="knob"></span>
                    </div>
                </div>
                <div class="trc-slider-group" id="trcAutotypeSliders">
                    <div class="trc-slider-row">
                        <label>Base WPM</label>
                        <span class="trc-slider-value" id="trcWpmValue">120</span>
                        <input type="range" min="30" max="600" value="120" id="trcWpmSlider">
                    </div>
                    <div class="trc-slider-row">
                        <label>Jitter (ms)</label>
                        <span class="trc-slider-value" id="trcJitterValue">15</span>
                        <input type="range" min="0" max="30" value="15" id="trcJitterSlider">
                    </div>
                    <div class="trc-slider-row">
                        <label>Pause Chance %</label>
                        <span class="trc-slider-value" id="trcPauseValue">15</span>
                        <input type="range" min="0" max="100" value="15" id="trcPauseSlider">
                    </div>
                </div>
            </div>
            <div class="trc-feature-item">
                <span class="trc-feature-label"><i class="fas fa-list-ul"></i> AutoQueue</span>
                <div class="trc-toggle" id="trcQueueToggle">
                    <span class="knob"></span>
                </div>
            </div>
            <div class="trc-feature-item">
                <span class="trc-feature-label"><i class="fas fa-puzzle-piece"></i> Auto Solve Challenge</span>
                <div class="trc-toggle" id="trcChallengeToggle">
                    <span class="knob"></span>
                </div>
            </div>
            <div class="trc-keybind-item">
                <span class="trc-keybind-label"><i class="fas fa-play"></i> New Game</span>
                <span class="trc-keybind-box" id="trcNewGameKeybind" role="button" tabindex="0">
                    <span id="trcKeyDisplay">Shift+Q</span>
                    <span class="hint" id="trcRecordingHint">click</span>
                </span>
            </div>
        </div>
    `;
    document.body.appendChild(panelElement);

    if (!document.querySelector('link[href*="font-awesome"]')) {
        const fontAwesomeLink = document.createElement('link');
        fontAwesomeLink.rel = 'stylesheet';
        fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
        document.head.appendChild(fontAwesomeLink);
    }

    const toastContainer = document.createElement('div');
    toastContainer.className = 'trc-toast-container';
    document.body.appendChild(toastContainer);

    function showToast(message, icon = 'fa-info-circle', duration = 3500) {
        const toastElement = document.createElement('div');
        toastElement.className = 'trc-toast';
        toastElement.innerHTML = `
            <i class="fas ${icon}"></i>
            <span class="toast-msg">${message}</span>
            <span class="toast-close"><i class="fas fa-times"></i></span>
        `;
        toastContainer.appendChild(toastElement);
        requestAnimationFrame(() => toastElement.classList.add('show'));

        const closeButton = toastElement.querySelector('.toast-close');
        closeButton.addEventListener('click', () => removeToast(toastElement));

        let timer = setTimeout(() => removeToast(toastElement), duration);
        toastElement.addEventListener('mouseenter', () => clearTimeout(timer));
        toastElement.addEventListener('mouseleave', () => {
            timer = setTimeout(() => removeToast(toastElement), 1000);
        });

        function removeToast(element) {
            if (!element || !element.parentNode) return;
            element.classList.remove('show');
            setTimeout(() => {
                if (element.parentNode) element.parentNode.removeChild(element);
            }, 400);
        }
    }

    const get = (id) => document.getElementById(id);

    const panel = panelElement;
    const dragHandle = get('trcDragHandle');
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    function onDragStart(event) {
        const ev = event.touches ? event.touches[0] : event;
        isDragging = true;
        panel.classList.add('dragging');
        const rect = panel.getBoundingClientRect();
        panel.style.left = rect.left + 'px';
        panel.style.top = rect.top + 'px';
        panel.style.right = 'auto';
        dragOffsetX = ev.clientX - rect.left;
        dragOffsetY = ev.clientY - rect.top;
        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('mouseup', onDragEnd);
        document.addEventListener('touchmove', onDragMove, { passive: false });
        document.addEventListener('touchend', onDragEnd, { passive: false });
        event.preventDefault();
    }

    function onDragMove(event) {
        if (!isDragging) return;
        const ev = event.touches ? event.touches[0] : event;
        let newX = ev.clientX - dragOffsetX;
        let newY = ev.clientY - dragOffsetY;
        const panelWidth = panel.offsetWidth;
        const panelHeight = panel.offsetHeight;
        const maxX = window.innerWidth - panelWidth - 10;
        const maxY = window.innerHeight - panelHeight - 10;
        newX = clamp(newX, 10, maxX);
        newY = clamp(newY, 10, maxY);
        panel.style.left = newX + 'px';
        panel.style.top = newY + 'px';
        if (event.cancelable) event.preventDefault();
    }

    function onDragEnd(event) {
        if (isDragging) {
            isDragging = false;
            panel.classList.remove('dragging');
            document.removeEventListener('mousemove', onDragMove);
            document.removeEventListener('mouseup', onDragEnd);
            document.removeEventListener('touchmove', onDragMove);
            document.removeEventListener('touchend', onDragEnd);
        }
    }

    dragHandle.addEventListener('mousedown', onDragStart);
    dragHandle.addEventListener('touchstart', onDragStart, { passive: false });
    dragHandle.addEventListener('selectstart', (e) => e.preventDefault());

    let autotypeActive = false;
    let autotypeRunId = 0;
    let autotypeTimer = null;
    let autotypeAttemptTimer = null;

    function getAutotypeConfig() {
        const wpm = parseInt(get('trcWpmSlider').value) || 120;
        const jitter = parseInt(get('trcJitterSlider').value) || 15;
        const pauseChance = (parseInt(get('trcPauseSlider').value) || 0) / 100;
        return { wpm, jitter, pauseChance, pauseExtra: 150 };
    }

    function startAutotype() {
        if (autotypeActive) return;
        autotypeActive = true;
        autotypeRunId++;
        showToast('Autotype has been enabled.', 'fa-bolt', 2000);
        attemptAutotype();
    }

    function stopAutotype() {
        autotypeActive = false;
        autotypeRunId++;
        if (autotypeTimer) {
            clearTimeout(autotypeTimer);
            autotypeTimer = null;
        }
        if (autotypeAttemptTimer) {
            clearTimeout(autotypeAttemptTimer);
            autotypeAttemptTimer = null;
        }
    }

    function attemptAutotype() {
        if (!autotypeActive) return;
        const input = document.querySelector('input[autocomplete="off"]');
        const chars = document.querySelectorAll('[data-char-index]');
        if (!input || !chars.length) {
            autotypeAttemptTimer = setTimeout(attemptAutotype, 300);
            return;
        }
        runTypingLoop(input, chars);
    }

    function runTypingLoop(input, chars) {
        const myRunId = autotypeRunId;

        function stillValid() {
            return autotypeActive && myRunId === autotypeRunId;
        }

        function waitForEnabled() {
            return new Promise((resolve) => {
                const check = () => {
                    if (!stillValid()) { resolve(false); return; }
                    if (!input.disabled) { resolve(true); return; }
                    setTimeout(check, 50);
                };
                check();
            });
        }

        function waitForStart() {
            return new Promise((resolve) => {
                const check = () => {
                    if (!stillValid()) { resolve(false); return; }
                    if (chars[0]?.classList.contains('underline')) { resolve(true); return; }
                    setTimeout(check, 50);
                };
                check();
            });
        }

        waitForEnabled().then((enabled) => {
            if (!enabled || !stillValid()) return;
            waitForStart().then((started) => {
                if (!started || !stillValid()) return;
                input.focus();
                const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
                let index = 0;

                function dispatchInput(char) {
                    const keydown = new KeyboardEvent('keydown', { key: char, bubbles: true });
                    const keyup = new KeyboardEvent('keyup', { key: char, bubbles: true });
                    input.dispatchEvent(keydown);
                    setter.call(input, input.value + char);
                    input.dispatchEvent(new InputEvent('input', { data: char, inputType: 'insertText', bubbles: true }));
                    input.dispatchEvent(keyup);
                }

                function nextChar() {
                    if (!stillValid() || index >= chars.length) {
                        if (index >= chars.length && stillValid()) {
                            showToast('Game done!', 'fa-check', 2000);
                        }
                        return;
                    }

                    const config = getAutotypeConfig();
                    const baseDelay = Math.round(60000 / (config.wpm * 5));
                    const char = chars[index].textContent;
                    let jitter = (Math.random() * config.jitter * 2) - config.jitter;
                    let delay = Math.max(10, baseDelay + jitter);
                    if (char === ' ' && Math.random() < config.pauseChance) {
                        delay += config.pauseExtra + Math.random() * 150;
                    }

                    autotypeTimer = setTimeout(() => {
                        if (!stillValid()) return;
                        dispatchInput(char);
                        index++;
                        nextChar();
                    }, delay);
                }

                nextChar();
            });
        });
    }

    const toggleElements = panel.querySelectorAll('.trc-toggle');
    toggleElements.forEach((toggle) => {
        toggle.addEventListener('click', function(event) {
            event.stopPropagation();
            this.classList.toggle('active');
            const group = this.closest('.trc-feature-group');
            if (group && group.id === 'trcAutotypeGroup') {
                const sliders = group.querySelectorAll('input[type="range"]');
                const isActive = this.classList.contains('active');
                sliders.forEach((slider) => slider.disabled = !isActive);
                if (isActive) {
                    startAutotype();
                } else {
                    stopAutotype();
                }
            }
            if (this.id === 'trcChallengeToggle') {
                if (this.classList.contains('active')) {
                    startAutoSolve();
                    showToast('Enabled Challenge Solver!', 'fa-puzzle-piece', 2500);
                } else {
                    stopAutoSolve();
                }
            }
            if (this.id === 'trcQueueToggle') {
                if (this.classList.contains('active')) {
                    startAutoQueue();
                } else {
                    stopAutoQueue();
                }
            }
        });
    });

    const expandIcon = get('trcAutotypeExpand');
    const sliderGroup = get('trcAutotypeSliders');
    let slidersOpen = false;
    expandIcon.addEventListener('click', function(event) {
        event.stopPropagation();
        slidersOpen = !slidersOpen;
        this.classList.toggle('open');
        sliderGroup.classList.toggle('open');
    });

    const wpmSlider = get('trcWpmSlider');
    const jitterSlider = get('trcJitterSlider');
    const pauseSlider = get('trcPauseSlider');
    const wpmValue = get('trcWpmValue');
    const jitterValue = get('trcJitterValue');
    const pauseValue = get('trcPauseValue');

    wpmSlider.addEventListener('input', () => {
        wpmValue.textContent = wpmSlider.value;
    });
    jitterSlider.addEventListener('input', () => {
        jitterValue.textContent = jitterSlider.value;
    });
    pauseSlider.addEventListener('input', () => {
        pauseValue.textContent = pauseSlider.value;
    });

    const autotypeToggle = get('trcAutotypeToggle');
    if (!autotypeToggle.classList.contains('active')) {
        document.querySelectorAll('#trcAutotypeSliders input[type="range"]').forEach((s) => s.disabled = true);
    }

    const keybindBox = get('trcNewGameKeybind');
    const keyDisplay = get('trcKeyDisplay');
    const hint = get('trcRecordingHint');

    let currentCombo = { modifiers: ['Shift'], key: 'Q' };

    function formatCombo(combo) {
        let parts = [...combo.modifiers];
        if (combo.key) parts.push(combo.key);
        return parts.join('+') || 'none';
    }

    function updateKeyDisplay() {
        keyDisplay.textContent = formatCombo(currentCombo);
    }

    let isRecording = false;

    function startRecording() {
        if (isRecording) return;
        isRecording = true;
        keybindBox.classList.add('recording');
        hint.textContent = 'press keys';
        document.addEventListener('keydown', captureKeyCombo);
    }

    function stopRecording(saveCombo) {
        isRecording = false;
        keybindBox.classList.remove('recording');
        document.removeEventListener('keydown', captureKeyCombo);
        if (saveCombo) {
            currentCombo = saveCombo;
            updateKeyDisplay();
            hint.textContent = 'click';
            showToast(`New Game keybind set to ${formatCombo(currentCombo)}`, 'fa-key', 3000);
        } else {
            hint.textContent = 'click';
        }
    }

    function captureKeyCombo(event) {
        event.preventDefault();
        event.stopPropagation();
        const key = event.key;
        if (key === 'Shift' || key === 'Control' || key === 'Alt' || key === 'Meta') return;
        if (key.length === 0 || key === 'Unidentified' || key === 'Dead') return;
        const modifiers = [];
        if (event.shiftKey) modifiers.push('Shift');
        if (event.ctrlKey) modifiers.push('Ctrl');
        if (event.altKey) modifiers.push('Alt');
        if (event.metaKey) modifiers.push('Meta');
        const combo = { modifiers: [...new Set(modifiers)], key: key };
        stopRecording(combo);
    }

    keybindBox.addEventListener('click', function(event) {
        event.stopPropagation();
        if (!isRecording) {
            startRecording();
        } else {
            stopRecording(false);
            updateKeyDisplay();
            hint.textContent = 'click';
        }
    });

    document.addEventListener('keydown', function(event) {
        if (isRecording && event.key === 'Escape') {
            event.preventDefault();
            stopRecording(false);
            updateKeyDisplay();
            hint.textContent = 'click';
        }
    });

    keybindBox.addEventListener('mousedown', (event) => event.stopPropagation());
    updateKeyDisplay();

    function isModifierActive(event, modifier) {
        if (modifier === 'Shift') return event.shiftKey;
        if (modifier === 'Ctrl') return event.ctrlKey;
        if (modifier === 'Alt') return event.altKey;
        if (modifier === 'Meta') return event.metaKey;
        return false;
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === currentCombo.key) {
            const activeModifiers = [];
            if (event.shiftKey) activeModifiers.push('Shift');
            if (event.ctrlKey) activeModifiers.push('Ctrl');
            if (event.altKey) activeModifiers.push('Alt');
            if (event.metaKey) activeModifiers.push('Meta');
            const modifiersMatch = (activeModifiers.length === currentCombo.modifiers.length) &&
                                   currentCombo.modifiers.every((m) => activeModifiers.includes(m));
            if (modifiersMatch) {
                event.preventDefault();
                event.stopPropagation();
                triggerNewGame();
            }
        }
    });

    let queueObserver = null;

    function startAutoQueue() {
        if (queueObserver) return;
        function clickRaceAgain() {
            const button = [...document.querySelectorAll('button')].find((btn) => btn.textContent.trim() === 'Race Again');
            if (button && !button.disabled) button.click();
        }
        queueObserver = new MutationObserver(() => clickRaceAgain());
        queueObserver.observe(document.body, { childList: true, subtree: true });
        clickRaceAgain();
    }

    function stopAutoQueue() {
        if (queueObserver) {
            queueObserver.disconnect();
            queueObserver = null;
        }
    }

    let solveObserver = null;
    let ocrRunning = false;
    let typingChallengeClicked = false;
    let challengePassedNotified = false;
    const OCR_ENDPOINT = 'https://test.idkbro-ec3.workers.dev/';

    function typeTextIntoInput(input, text, callback) {
        if (!text || text.length === 0) {
            if (callback) callback();
            return;
        }
        let index = 0;
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;

        function typeNextChar() {
            if (index >= text.length) {
                if (callback) callback();
                return;
            }
            const char = text[index];

            const keydown = new KeyboardEvent('keydown', { key: char, bubbles: true });
            const keyup = new KeyboardEvent('keyup', { key: char, bubbles: true });
            input.dispatchEvent(keydown);

            setter.call(input, input.value + char);
            input.dispatchEvent(new InputEvent('input', { data: char, inputType: 'insertText', bubbles: true }));
            input.dispatchEvent(keyup);
            index++;

            setTimeout(typeNextChar, 20);
        }

        input.focus();
        typeNextChar();
    }

    function setInputValue(input, value) {

        input.value = value;
        input.dispatchEvent(new Event('focus', { bubbles: true }));
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        input.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        input.dispatchEvent(new Event('blur', { bubbles: true }));
    }

    async function preprocessImage(url) {
        const img = await new Promise((resolve, reject) => {
            const image = new Image();
            image.crossOrigin = 'anonymous';
            image.onload = () => resolve(image);
            image.onerror = reject;
            image.src = url;
        });
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;
        const contrast = 1.4;
        for (let i = 0; i < data.length; i += 4) {
            let gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            gray = ((gray - 128) * contrast) + 128;
            gray = Math.max(0, Math.min(255, gray));
            data[i] = data[i + 1] = data[i + 2] = gray;
        }
        const threshold = 155;
        for (let i = 0; i < data.length; i += 4) {
            const value = data[i] < threshold ? 0 : 255;
            data[i] = data[i + 1] = data[i + 2] = value;
        }
        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL('image/png', 1);
    }

    async function performOCR(imageDataURL) {
        const response = await fetch(OCR_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: imageDataURL
            })
        });

        const raw = await response.text();

        console.log('TRC Worker status:', response.status);
        console.log('TRC Worker response:', raw);

        let json;

        try {
            json = JSON.parse(raw);
        } catch (error) {
            throw new Error(
                `Worker returned invalid JSON: ${raw}`
            );
        }

        if (!response.ok) {
            throw new Error(
                json?.message ||
                json?.error ||
                `Worker returned HTTP ${response.status}`
            );
        }

        if (json?.error) {
            throw new Error(
                json.message || json.error
            );
        }

        if (!json?.text) {
            throw new Error('Worker returned no OCR text');
        }

        return json.text.trim();
    }

    function cleanText(text) {
        return text
            .replace(/[|]/g, 'I')
            .replace(/(?<=\D)0(?=\D)/g, 'O')
            .replace(/(?<=\D)1(?=\D)/g, 'I')
            .replace(/\s+/g, ' ')
            .trim();
    }

    async function processChallengeModal(modalDiv) {
        if (ocrRunning) return;
        ocrRunning = true;
        showToast('Sending to API..', 'fa-cloud-upload-alt', 2000);
        const imgElement = modalDiv.querySelector('img[alt*="Challenge text"]');
        if (!imgElement) {
            ocrRunning = false;
            return;
        }
        let imgSrc = imgElement.src;
        if (!imgSrc.startsWith('http')) {
            imgSrc = window.location.origin + imgSrc;
        }
        try {
            const processedDataURL = await preprocessImage(imgSrc);
            const ocrResult = await performOCR(processedDataURL);
            const cleaned = cleanText(ocrResult);
            const inputField = modalDiv.querySelector('input[type="text"]');
            if (!inputField) {
                ocrRunning = false;
                return;
            }

            await new Promise((resolve) => {
                typeTextIntoInput(inputField, cleaned, resolve);
            });

            const buttons = modalDiv.querySelectorAll('button');
            let submitButton = null;
            for (const btn of buttons) {
                if (btn.textContent.trim().toLowerCase() === 'submit') {
                    submitButton = btn;
                    break;
                }
            }
            if (submitButton) {
                setTimeout(() => submitButton.click(), 50);
            }
        } catch (error) {
            console.error(error);
        } finally {
            ocrRunning = false;
        }
    }

    function checkForModals() {
        const dialogs = document.querySelectorAll('div[role="alertdialog"]');
        for (const dialog of dialogs) {
            const titleElement = dialog.querySelector('h2[id$="-modal-title"]');
            if (!titleElement) continue;
            const title = titleElement.textContent.trim();

            if (title === 'Typing Challenge') {
                if (!typingChallengeClicked) {
                    const buttons = dialog.querySelectorAll('button');
                    let beginButton = null;
                    for (const btn of buttons) {
                        if (btn.textContent.trim().toLowerCase() === 'begin test') {
                            beginButton = btn;
                            break;
                        }
                    }
                    if (beginButton) {
                        beginButton.click();
                        typingChallengeClicked = true;
                        showToast('Challenge detected..', 'fa-exclamation-triangle', 2500);
                    }
                }
                continue;
            }

            if (title === 'High-Speed Verification') {
                if (dialog.dataset.ocrProcessed) continue;
                const img = dialog.querySelector('img[alt*="Challenge text"]');
                if (img) {
                    dialog.dataset.ocrProcessed = 'true';
                    processChallengeModal(dialog);
                } else {
                    setTimeout(() => {
                        if (!dialog.dataset.ocrProcessed) {
                            const imgAgain = dialog.querySelector('img[alt*="Challenge text"]');
                            if (imgAgain) {
                                dialog.dataset.ocrProcessed = 'true';
                                processChallengeModal(dialog);
                            }
                        }
                    }, 500);
                }
            }
        }

        const passedHeading = [...document.querySelectorAll('h2')].some((h2) => h2.textContent.trim() === 'Typing Challenge Passed');
        if (passedHeading && !challengePassedNotified) {
            challengePassedNotified = true;
            showToast('Passed!', 'fa-check-circle', 3000);
            setTimeout(() => { challengePassedNotified = false; }, 5000);
        }
    }

    function startAutoSolve() {
        if (solveObserver) return;
        typingChallengeClicked = false;
        challengePassedNotified = false;
        checkForModals();
        solveObserver = new MutationObserver(() => checkForModals());
        solveObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src', 'class']
        });
    }

    function stopAutoSolve() {
        if (solveObserver) {
            solveObserver.disconnect();
            solveObserver = null;
        }
    }

    let newGameRunning = false;

    function triggerNewGame() {
        if (newGameRunning) return;
        newGameRunning = true;
        let step = 0;
        const observer = new MutationObserver(() => {
            if (step === 0) {
                const raceAgain = [...document.querySelectorAll('button')].find((btn) => btn.textContent.trim() === 'Race Again');
                if (raceAgain && !raceAgain.disabled) {
                    raceAgain.click();
                    step = 1;
                }
            } else if (step === 1) {
                const leaveRacetrack = [...document.querySelectorAll('button')].find((btn) => btn.textContent.trim() === '« Leave Racetrack');
                if (leaveRacetrack && !leaveRacetrack.disabled) {
                    leaveRacetrack.click();
                    step = 2;
                }
            } else if (step === 2) {
                const enterRace = [...document.querySelectorAll('button')].find((btn) => btn.textContent.trim() === 'Enter a Typing Race');
                if (enterRace && !enterRace.disabled) {
                    enterRace.click();
                    observer.disconnect();
                    newGameRunning = false;
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true, characterData: true });

        const clickIfPresent = (text) => {
            const button = [...document.querySelectorAll('button')].find((btn) => btn.textContent.trim() === text);
            if (button && !button.disabled) {
                button.click();
                return true;
            }
            return false;
        };

        if (clickIfPresent('Race Again')) {
            step = 1;
        } else if (clickIfPresent('« Leave Racetrack')) {
            step = 2;
        } else if (clickIfPresent('Enter a Typing Race')) {
            observer.disconnect();
            newGameRunning = false;
        }
        showToast('Started new game.', 'fa-play', 2500);
    }

    console.log('enjoy.');
})();
