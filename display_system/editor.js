// ------------------------------------
// Notice Editor Module
// ------------------------------------

// Selection Saving Logic
let savedRange = null;

document.addEventListener('DOMContentLoaded', () => {
    const editorCallback = () => {
        const sel = window.getSelection();
        if (sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            const editor = document.getElementById('notice-content');
            if (editor && editor.contains(range.commonAncestorContainer)) {
                savedRange = range.cloneRange();
            }
        }
    };

    const editor = document.getElementById('notice-content');
    if (editor) {
        editor.addEventListener('keyup', editorCallback);
        editor.addEventListener('mouseup', editorCallback);
        editor.addEventListener('focus', editorCallback);
        // CRITICAL: Save selection when editor loses focus (before clicking toolbar)
        editor.addEventListener('blur', editorCallback);
    }
});

// ------------------------------------
// Notice Editor Functions
// ------------------------------------

function renderNoticeEditor() {
    document.getElementById('notice-enabled').checked = pendingConfig.notice.enabled;
    document.getElementById('notice-title').value = pendingConfig.notice.title;
    document.getElementById('notice-content').innerHTML = pendingConfig.notice.content;
    updateNoticeEditorVisibility();
}

function updateNoticeEditorVisibility() {
    const wrapper = document.getElementById('notice-editor-wrapper');
    if (pendingConfig.notice.enabled) {
        wrapper.classList.remove('opacity-40', 'pointer-events-none');
    } else {
        wrapper.classList.add('opacity-40', 'pointer-events-none');
    }
}

function toggleNotice(enabled) {
    pendingConfig.notice.enabled = enabled;
    updateNoticeEditorVisibility();
}

function updateNotice(field, value) {
    pendingConfig.notice[field] = value;
}

function formatText(command) {
    document.execCommand(command, false, null);
    document.getElementById('notice-content').focus();
}

function setFontSize(size) {
    // Use saved range if available, otherwise current selection
    let range = null;
    const sel = window.getSelection();

    if (savedRange) {
        range = savedRange;
        // Restore selection visually if possible (optional, but good UX)
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (sel.rangeCount > 0) {
        range = sel.getRangeAt(0);
    }

    if (range) {
        // Ensure range is inside editor
        if (!document.getElementById('notice-content').contains(range.commonAncestorContainer)) {
            console.log("Selection outside editor");
            return;
        }

        const span = document.createElement('span');
        span.style.fontSize = size + 'px';

        if (range.collapsed) {
            document.getElementById('notice-content').focus();
            return;
        }

        try {
            const content = range.extractContents();
            span.appendChild(content);
            range.insertNode(span);

            // Update State manually since DOM manipulation doesn't trigger input event
            updateNotice('content', document.getElementById('notice-content').innerHTML);

            // Update saved range to include new span
            savedRange = document.createRange();
            savedRange.selectNodeContents(span);
            sel.removeAllRanges();
            sel.addRange(savedRange);
        } catch (e) {
            console.error('Font size application failed:', e);
        }
    }
    document.getElementById('notice-content').focus();
}

function setTextColor(color) {
    // Use saved range if available, otherwise current selection
    let range = null;
    const sel = window.getSelection();

    if (savedRange) {
        range = savedRange;
        // Restore selection visually if possible (optional, but good UX)
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (sel.rangeCount > 0) {
        range = sel.getRangeAt(0);
    }

    if (range) {
        // Ensure range is inside editor
        if (!document.getElementById('notice-content').contains(range.commonAncestorContainer)) {
            console.log("Selection outside editor");
            return;
        }

        const span = document.createElement('span');
        span.style.color = color;

        if (range.collapsed) {
            document.getElementById('notice-content').focus();
            return;
        }

        try {
            const content = range.extractContents();
            span.appendChild(content);
            range.insertNode(span);

            // Update State manually since DOM manipulation doesn't trigger input event
            updateNotice('content', document.getElementById('notice-content').innerHTML);

            // Update saved range to include new span
            savedRange = document.createRange();
            savedRange.selectNodeContents(span);
            sel.removeAllRanges();
            sel.addRange(savedRange);
        } catch (e) {
            console.error('Color application failed:', e);
        }
    }
    document.getElementById('notice-content').focus();
}

function setLineHeight(value) {
    let range = null;
    const sel = window.getSelection();

    if (savedRange) {
        range = savedRange;
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (sel.rangeCount > 0) {
        range = sel.getRangeAt(0);
    }

    if (range) {
        if (!document.getElementById('notice-content').contains(range.commonAncestorContainer)) return;

        const span = document.createElement('span');
        span.style.lineHeight = value;

        if (range.collapsed) {
            document.getElementById('notice-content').focus();
            return;
        }

        try {
            const content = range.extractContents();
            span.appendChild(content);
            range.insertNode(span);

            updateNotice('content', document.getElementById('notice-content').innerHTML);

            savedRange = document.createRange();
            savedRange.selectNodeContents(span);
            sel.removeAllRanges();
            sel.addRange(savedRange);
        } catch (e) {
            console.error('Line height application failed:', e);
        }
    }
    document.getElementById('notice-content').focus();
}

function setLetterSpacing(value) {
    let range = null;
    const sel = window.getSelection();

    if (savedRange) {
        range = savedRange;
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (sel.rangeCount > 0) {
        range = sel.getRangeAt(0);
    }

    if (range) {
        if (!document.getElementById('notice-content').contains(range.commonAncestorContainer)) return;

        const span = document.createElement('span');
        span.style.letterSpacing = value + 'px';

        if (range.collapsed) {
            document.getElementById('notice-content').focus();
            return;
        }

        try {
            const content = range.extractContents();
            span.appendChild(content);
            range.insertNode(span);

            updateNotice('content', document.getElementById('notice-content').innerHTML);

            savedRange = document.createRange();
            savedRange.selectNodeContents(span);
            sel.removeAllRanges();
            sel.addRange(savedRange);
        } catch (e) {
            console.error('Letter spacing application failed:', e);
        }
    }
    document.getElementById('notice-content').focus();
}

function handlePaste(e) {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text/plain');
    document.execCommand('insertText', false, text);
}

// ------------------------------------
// Notice Preview Functions
// ------------------------------------

function previewNotice() {
    const container = document.getElementById('preview-content');
    container.innerHTML = `
        <div class="slide flex flex-col items-center justify-center p-0 bg-slate-50 relative overflow-hidden w-full h-full">
            <div class="absolute inset-0 z-0 opacity-40" style="background-image: radial-gradient(#FF7A00 1px, transparent 1px); background-size: 40px 40px;"></div>
            <div class="absolute top-0 right-0 w-[50vh] h-[50vh] bg-orange-100 rounded-bl-full -z-10 blur-3xl opacity-60"></div>
            <div class="absolute bottom-0 left-0 w-[60vh] h-[60vh] bg-blue-50 rounded-tr-full -z-10 blur-3xl opacity-60"></div>
            <div class="max-w-[92%] w-full h-[88%] z-10 flex flex-col justify-center relative">
                <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-8 py-3 rounded-full shadow-lg border border-slate-100 flex items-center gap-3 z-20">
                    <div class="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                    <span class="font-black text-slate-700 tracking-widest text-lg">OFFICIAL NOTICE</span>
                </div>
                <div class="bg-white/80 backdrop-blur-xl rounded-[4rem] w-full h-full shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] border border-white/50 flex flex-col items-center justify-start text-center p-12 pt-40 relative overflow-hidden">
                    <div class="absolute top-0 w-full h-2 bg-gradient-to-r from-juo-orange via-yellow-400 to-juo-orange"></div>
                    <div class="mb-14 relative">
                        <h2 class="text-8xl font-black text-slate-800 leading-tight tracking-tight drop-shadow-sm">${config.notice.title || '공지 제목'}</h2>
                        <div class="w-32 h-2 bg-juo-orange mx-auto mt-8 rounded-full opacity-30"></div>
                    </div>
                    <div class="relative w-full max-w-6xl">
                        <div class="text-6xl leading-[1.6] text-slate-600 font-medium break-all" style="white-space: pre-wrap; word-wrap: break-word;">${config.notice.content || '<p>공지 내용을 입력해주세요.</p>'}</div>
                    </div>
                </div>
            </div>
        </div>`;
    lucide.createIcons();
    document.getElementById('preview-container').classList.remove('hidden');
    
    // Enter fullscreen
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch((e) => { });
    }
    
    document.addEventListener('keydown', handlePreviewEscape);
}

function handlePreviewEscape(e) {
    if (e.key === 'Escape') {
        // First ESC exits fullscreen, second ESC closes preview
        if (document.fullscreenElement) {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch((e) => { });
            }
        } else {
            closePreview();
        }
    }
}

function closePreview() {
    document.getElementById('preview-container').classList.add('hidden');
    document.getElementById('preview-content').innerHTML = '';
    document.removeEventListener('keydown', handlePreviewEscape);
    document.removeEventListener('keydown', handleSlidePreviewEscape);

    if (document.exitFullscreen) {
        document.exitFullscreen().catch((e) => { });
    }
}

// Expose functions to window for inline HTML handlers
window.renderNoticeEditor = renderNoticeEditor;
window.updateNoticeEditorVisibility = updateNoticeEditorVisibility;
window.toggleNotice = toggleNotice;
window.updateNotice = updateNotice;
window.formatText = formatText;
window.setFontSize = setFontSize;
window.setTextColor = setTextColor;
window.setLineHeight = setLineHeight;
window.setLetterSpacing = setLetterSpacing;
window.handlePaste = handlePaste;
window.previewNotice = previewNotice;
window.handlePreviewEscape = handlePreviewEscape;
window.closePreview = closePreview;
