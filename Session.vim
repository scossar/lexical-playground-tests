let SessionLoad = 1
let s:so_save = &g:so | let s:siso_save = &g:siso | setg so=0 siso=0 | setl so=-1 siso=-1
let v:this_session=expand("<sfile>:p")
silent only
silent tabonly
cd ~/remix/discourse/lexical-playground
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
let s:shortmess_save = &shortmess
if &shortmess =~ 'A'
  set shortmess=aoOA
else
  set shortmess=aoO
endif
badd +1 term://~/remix/discourse/lexical-playground//311076:/bin/bash
badd +6 tailwind.config.ts
badd +3 app/tailwind.css
badd +12 app/root.tsx
badd +28 app/routes/_index.tsx
badd +13 app/hooks/useHydrate.ts
badd +1 app/components/ClientOnly.tsx
badd +1 app/hooks/useHydrated.ts
badd +24 app/components/Composer.tsx
badd +27 ~/.config/nvim/init.lua
badd +0 term://~/remix/discourse/lexical-playground//358560:/bin/bash
badd +26 app/components/Editor.tsx
badd +1 package.json
badd +2 node_modules/vite-node/vite-node.mjs
badd +35 app/plugins/ToolbarPlugin.tsx
badd +120 app/components/Toolbar.tsx
badd +0 Lexical.md
badd +10 vite.config.ts
badd +1 tsconfig.json
badd +173 app/ui/DropDown.tsx
badd +5 app/editorNodes/editorNodes.ts
badd +244 app/ui/DropDownBak.tsx
badd +53 app/themes/PlaygroundEditorTheme.css
badd +23 app/ui/ContentEditable.css
badd +12 app/themes/ZalgorithmEditorTheme.css
badd +112 app/themes/PlaygroundEditorTheme.ts
badd +10 app/themes/ZalgorithmEditorTheme.ts
argglobal
%argdel
edit app/components/Toolbar.tsx
let s:save_splitbelow = &splitbelow
let s:save_splitright = &splitright
set splitbelow splitright
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd w
wincmd _ | wincmd |
split
1wincmd k
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd w
wincmd w
wincmd _ | wincmd |
vsplit
wincmd _ | wincmd |
vsplit
2wincmd h
wincmd w
wincmd w
let &splitbelow = s:save_splitbelow
let &splitright = s:save_splitright
wincmd t
let s:save_winminheight = &winminheight
let s:save_winminwidth = &winminwidth
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
wincmd =
argglobal
enew
file NERD_tree_tab_1
balt app/ui/DropDown.tsx
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal nofen
wincmd w
argglobal
balt app/themes/ZalgorithmEditorTheme.ts
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let &fdl = &fdl
let s:l = 89 - ((29 * winheight(0) + 26) / 52)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 89
normal! 09|
wincmd w
argglobal
if bufexists(fnamemodify("app/ui/DropDown.tsx", ":p")) | buffer app/ui/DropDown.tsx | else | edit app/ui/DropDown.tsx | endif
if &buftype ==# 'terminal'
  silent file app/ui/DropDown.tsx
endif
balt app/themes/PlaygroundEditorTheme.ts
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let &fdl = &fdl
let s:l = 174 - ((39 * winheight(0) + 26) / 52)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 174
normal! 06|
wincmd w
argglobal
enew
balt app/routes/_index.tsx
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
wincmd w
argglobal
if bufexists(fnamemodify("term://~/remix/discourse/lexical-playground//311076:/bin/bash", ":p")) | buffer term://~/remix/discourse/lexical-playground//311076:/bin/bash | else | edit term://~/remix/discourse/lexical-playground//311076:/bin/bash | endif
if &buftype ==# 'terminal'
  silent file term://~/remix/discourse/lexical-playground//311076:/bin/bash
endif
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
let s:l = 132 - ((19 * winheight(0) + 10) / 20)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 132
normal! 058|
wincmd w
argglobal
if bufexists(fnamemodify("term://~/remix/discourse/lexical-playground//358560:/bin/bash", ":p")) | buffer term://~/remix/discourse/lexical-playground//358560:/bin/bash | else | edit term://~/remix/discourse/lexical-playground//358560:/bin/bash | endif
if &buftype ==# 'terminal'
  silent file term://~/remix/discourse/lexical-playground//358560:/bin/bash
endif
balt app/routes/_index.tsx
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
let s:l = 360 - ((8 * winheight(0) + 10) / 20)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 360
normal! 0
wincmd w
5wincmd w
wincmd =
tabnext 1
if exists('s:wipebuf') && len(win_findbuf(s:wipebuf)) == 0 && getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20
let &shortmess = s:shortmess_save
let &winminheight = s:save_winminheight
let &winminwidth = s:save_winminwidth
let s:sx = expand("<sfile>:p:r")."x.vim"
if filereadable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &g:so = s:so_save | let &g:siso = s:siso_save
set hlsearch
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
