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
badd +1 app/components/Editor.tsx
badd +23 app/themes/ZalgorithmEditorTheme.css
badd +11 ~/.config/nvim/coc-settings.json
argglobal
%argdel
edit app/themes/ZalgorithmEditorTheme.css
let s:save_splitbelow = &splitbelow
let s:save_splitright = &splitright
set splitbelow splitright
wincmd _ | wincmd |
vsplit
wincmd _ | wincmd |
vsplit
2wincmd h
wincmd w
wincmd w
wincmd _ | wincmd |
split
1wincmd k
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
exe 'vert 1resize ' . ((&columns * 31 + 191) / 382)
exe 'vert 2resize ' . ((&columns * 175 + 191) / 382)
exe '3resize ' . ((&lines * 31 + 37) / 75)
exe 'vert 3resize ' . ((&columns * 174 + 191) / 382)
exe '4resize ' . ((&lines * 41 + 37) / 75)
exe 'vert 4resize ' . ((&columns * 174 + 191) / 382)
argglobal
enew
file NERD_tree_tab_1
balt app/components/Editor.tsx
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
balt ~/.config/nvim/coc-settings.json
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
let s:l = 23 - ((22 * winheight(0) + 36) / 73)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 23
normal! 07|
wincmd w
argglobal
enew | setl bt=help
help coc-config@en
balt ~/.config/nvim/coc-settings.json
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
let s:l = 1720 - ((0 * winheight(0) + 15) / 31)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 1720
normal! 057|
wincmd w
argglobal
if bufexists(fnamemodify("~/.config/nvim/coc-settings.json", ":p")) | buffer ~/.config/nvim/coc-settings.json | else | edit ~/.config/nvim/coc-settings.json | endif
if &buftype ==# 'terminal'
  silent file ~/.config/nvim/coc-settings.json
endif
balt app/themes/ZalgorithmEditorTheme.css
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
let s:l = 11 - ((10 * winheight(0) + 20) / 41)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 11
normal! 034|
wincmd w
4wincmd w
exe 'vert 1resize ' . ((&columns * 31 + 191) / 382)
exe 'vert 2resize ' . ((&columns * 175 + 191) / 382)
exe '3resize ' . ((&lines * 31 + 37) / 75)
exe 'vert 3resize ' . ((&columns * 174 + 191) / 382)
exe '4resize ' . ((&lines * 41 + 37) / 75)
exe 'vert 4resize ' . ((&columns * 174 + 191) / 382)
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
