document.body.insertAdjacentHTML('afterBegin', `<svg style="position: absolute; width: 0; height: 0; overflow: hidden;" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <symbol id="vditor-icon-comment" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M28.8 24.272l-1.872-1.872h-23.728v-19.2h25.6v21.072zM28.8 0h-25.6c-1.76 0-3.2 1.44-3.2 3.2v19.2c0 1.76 1.44 3.2 3.2 3.2h22.4l6.4 6.4v-28.8c0-1.76-1.44-3.2-3.2-3.2z"></path>
    </symbol>
    <symbol id="vditor-icon-headings" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M6 12h12"/><path d="M6 20V4"/><path d="M18 20V4"/>
    </symbol>
    <symbol id="vditor-icon-before" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M1.462 26.507h21.543v-3.276h-21.543v3.276z"></path>
      <path d="M1.462 9.928h16.48v-3.276h-16.48v3.276z"></path>
      <path d="M1.462 18.217h21.543v-3.276h-21.543v3.276z"></path>
      <path d="M24.366 8.29l6.171-5.952-2.43-2.338-8.619 8.29 8.619 8.29 2.43-2.337-6.171-5.953z"></path>
    </symbol>
    <symbol id="vditor-icon-after" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M1.462 5.493h21.543v3.276h-21.543v-3.276z"></path>
      <path d="M1.462 22.072h16.48v3.276h-16.48v-3.276z"></path>
      <path d="M1.462 13.783h21.543v3.276h-21.543v-3.276z"></path>
      <path d="M24.366 23.71l6.171 5.952-2.43 2.338-8.619-8.29 8.619-8.29 2.43 2.337-6.171 5.953z"></path>
    </symbol>
    <symbol id="vditor-icon-delete-column" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M5.279 0v23.265h3.538v-23.265h-3.538z"></path>
      <path d="M23.183 0v23.265h3.538v-23.265h-3.538z"></path>
      <path d="M14.231 0v17.797h3.538v-17.797h-3.538z"></path>
      <path d="M16 28.387l3.613 3.613 2.023-2.023-3.613-3.613 3.613-3.613-2.023-2.023-3.613 3.613-3.613-3.613-2.023 2.023 3.613 3.613-3.613 3.613 2.023 2.023 3.613-3.613z"></path>
    </symbol>
    <symbol id="vditor-icon-delete-row" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M0 5.279h23.265v3.538h-23.265v-3.538z"></path>
      <path d="M0 23.183h23.265v3.538h-23.265v-3.538z"></path>
      <path d="M0 14.231h17.797v3.538h-17.797v-3.538z"></path>
      <path d="M28.387 16l3.613 3.613-2.023 2.023-3.613-3.613-3.613 3.613-2.023-2.023 3.613-3.613-3.613-3.613 2.023-2.023 3.613 3.613 3.613-3.613 2.023 2.023-3.613 3.613z"></path>
    </symbol>
    <symbol id="vditor-icon-insert-row" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M1.462 5.493h21.543v3.276h-21.543v-3.276z"></path>
      <path d="M1.462 22.072h16.48v3.276h-16.48v-3.276z"></path>
      <path d="M1.462 13.783h21.543v3.276h-21.543v-3.276z"></path>
      <path d="M24.366 23.71l6.171 5.952-2.43 2.338-8.619-8.29 8.619-8.29 2.43 2.337-6.171 5.953z"></path>
    </symbol>
    <symbol id="vditor-icon-insert-rowb" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M1.462 26.507h21.543v-3.276h-21.543v3.276z"></path>
      <path d="M1.462 9.928h16.48v-3.276h-16.48v3.276z"></path>
      <path d="M1.462 18.217h21.543v-3.276h-21.543v3.276z"></path>
      <path d="M24.366 8.29l6.171-5.952-2.43-2.338-8.619 8.29 8.619 8.29 2.43-2.337-6.171-5.953z"></path>
    </symbol>
    <symbol id="vditor-icon-insert-column" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M5.493 1.462v21.543h3.276v-21.543h-3.276z"></path>
      <path d="M22.072 1.462v16.48h3.276v-16.48h-3.276z"></path>
      <path d="M13.783 1.462v21.543h3.276v-21.543h-3.276z"></path>
      <path d="M23.71 24.366l5.952 6.171 2.338-2.43-8.29-8.619-8.29 8.619 2.337 2.43 5.953-6.171z"></path>
    </symbol>
    <symbol id="vditor-icon-insert-columnb" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M26.507 1.462v21.543h-3.276v-21.543h3.276z"></path>
      <path d="M9.928 1.462v16.48h-3.276v-16.48h3.276z"></path>
      <path d="M18.217 1.462v21.543h-3.276v-21.543h3.276z"></path>
      <path d="M8.29 24.366l-5.952 6.171-2.338-2.43 8.29-8.619 8.29 8.619-2.337 2.43-5.953-6.171z"></path>
    </symbol>
    <symbol id="vditor-icon-code-theme" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
        <path d="M28.444 12.444v16h-24.924v-24.889h16v-3.556h-15.964c-1.956 0-3.556 1.6-3.556 3.556v24.889c0 1.956 1.6 3.556 3.556 3.556h24.889c1.956 0 3.556-1.6 3.556-3.556v-16h-3.556zM23.218 8.782l1.671 3.662 1.671-3.662 3.662-1.671-3.662-1.671-1.671-3.662-1.671 3.662-3.662 1.671zM16 8.889l-2.222 4.889-4.889 2.222 4.889 2.222 2.222 4.889 2.222-4.889 4.889-2.222-4.889-2.222z"></path>
    </symbol>
    <symbol id="vditor-icon-code" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    </symbol>
    <symbol id="vditor-icon-table" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/>  
    </symbol>
    <symbol id="vditor-icon-export" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M4 7V4a2 2 0 0 1 2-2 2 2 0 0 0-2 2"/><path d="M4.063 20.999a2 2 0 0 0 2 1L18 22a2 2 0 0 0 2-2V7l-5-5H6"/><path d="m5 11-3 3"/><path d="m5 17-3-3h10"/>  
    </symbol>
    <symbol id="vditor-icon-resize" viewBox="0 0 128 32">
      <path d="M128 32v-5.334h-128v5.334h128zM128 18.666v-5.331h-128v5.331h128zM0 5.334h128v-5.334h-128v5.334z"></path>
    </symbol>
    <symbol id="vditor-icon-edit" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M12 17v4"/><path d="m15.2 4.9-.9-.4"/><path d="m15.2 7.1-.9.4"/><path d="m16.9 3.2-.4-.9"/><path d="m16.9 8.8-.4.9"/><path d="m19.5 2.3-.4.9"/><path d="m19.5 9.7-.4-.9"/><path d="m21.7 4.5-.9.4"/><path d="m21.7 7.5-.9-.4"/><path d="M22 13v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/><path d="M8 21h8"/><circle cx="18" cy="6" r="3"/>    
    </symbol>
    <symbol id="vditor-icon-quote" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/>    
    </symbol>
    <symbol id="vditor-icon-strike" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/><line x1="4" x2="20" y1="12" y2="12"/> 
    </symbol>
    <symbol id="vditor-icon-line" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/>
    </symbol>
    <symbol id="vditor-icon-both" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
        <path d="M2.909 3.636h26.182c1.6 0 2.909 1.309 2.909 2.909v18.909c0 1.6-1.309 2.909-2.909 2.909h-26.182c-1.6 0-2.909-1.309-2.909-2.909v-18.909c0-1.6 1.309-2.909 2.909-2.909zM29.091 25.455v-18.909h-11.636v18.909h11.636zM2.909 25.455h11.636v-18.909h-11.636v18.909zM13.091 11.636h-8.727v2.182h8.727zM13.091 15.273h-8.727v2.182h8.727zM13.091 18.909h-8.727v2.182h8.727z"></path>
    </symbol>
    <symbol id="vditor-icon-copy" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
    </symbol>
    <symbol id="vditor-icon-trashcan" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
    </symbol>
    <symbol id="vditor-icon-more" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M4 12c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zM28 12c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zM16 12c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4z"></path>
    </symbol>
    <symbol id="vditor-icon-upload" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>  
    </symbol>
    <symbol id="vditor-icon-bug" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M30.222 8.889h-4.996c-0.8-1.387-1.902-2.578-3.236-3.484l2.898-2.898-2.507-2.507-3.858 3.858c-0.818-0.196-1.653-0.302-2.524-0.302s-1.707 0.107-2.507 0.302l-3.876-3.858-2.507 2.507 2.88 2.898c-1.316 0.907-2.418 2.098-3.218 3.484h-4.996v3.556h3.716c-0.089 0.587-0.16 1.173-0.16 1.778v1.778h-3.556v3.556h3.556v1.778c0 0.604 0.071 1.191 0.16 1.778h-3.716v3.556h4.996c1.849 3.182 5.28 5.333 9.227 5.333s7.378-2.151 9.227-5.333h4.996v-3.556h-3.716c0.089-0.587 0.16-1.173 0.16-1.778v-1.778h3.556v-3.556h-3.556v-1.778c0-0.604-0.071-1.191-0.16-1.778h3.716v-3.556zM23.111 16v5.333c0 0.391-0.053 0.836-0.124 1.244l-0.178 1.156-0.658 1.156c-1.28 2.204-3.627 3.556-6.151 3.556s-4.871-1.369-6.151-3.556l-0.658-1.138-0.178-1.156c-0.071-0.409-0.124-0.853-0.124-1.262v-7.111c0-0.409 0.053-0.853 0.124-1.244l0.178-1.156 0.658-1.156c0.533-0.924 1.28-1.724 2.151-2.329l1.013-0.693 1.316-0.32c0.551-0.142 1.12-0.213 1.671-0.213 0.569 0 1.12 0.071 1.689 0.213l1.209 0.284 1.084 0.747c0.889 0.604 1.618 1.387 2.151 2.329l0.676 1.156 0.178 1.156c0.071 0.391 0.124 0.836 0.124 1.227v1.778zM12.444 19.556h7.111v3.556h-7.111zM12.444 12.445h7.111v3.556h-7.111z"></path>
    </symbol>
    <symbol id="vditor-icon-contract" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M32 2.256l-8.464 8.464 5.264 5.28h-12.8v-12.8l5.264 5.264 8.48-8.464 2.256 2.256zM2.256 32l8.464-8.464 5.28 5.264v-12.8h-12.8l5.264 5.264-8.464 8.48 2.256 2.256z"></path>
    </symbol>
    <symbol id="vditor-icon-inline-code" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="m18 8 4 4-4 4"/><path d="m6 8-4 4 4 4"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/>  
    </symbol>
    <symbol id="vditor-icon-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="m6 9 6 6 6-6"/>
    </symbol>
    <symbol id="vditor-icon-up" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="m18 15-6-6-6 6"/>
    </symbol>
    <symbol id="vditor-icon-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <rect x="3" y="5" width="6" height="6" rx="1"/><path d="m3 17 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>  
    </symbol>
    <symbol id="vditor-icon-theme" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M16 32c-8.816 0-16-7.184-16-16s7.184-16 16-16 16 6.464 16 14.4c0 5.296-4.304 9.6-9.6 9.6h-2.832c-0.448 0-0.8 0.352-0.8 0.8 0 0.192 0.080 0.368 0.208 0.528 0.656 0.752 1.024 1.696 1.024 2.672 0 2.208-1.792 4-4 4zM16 3.2c-7.056 0-12.8 5.744-12.8 12.8s5.744 12.8 12.8 12.8c0.448 0 0.8-0.352 0.8-0.8 0-0.256-0.128-0.448-0.224-0.56-0.656-0.736-1.008-1.68-1.008-2.64 0-2.208 1.792-4 4-4h2.832c3.536 0 6.4-2.864 6.4-6.4 0-6.176-5.744-11.2-12.8-11.2z"></path>
      <path d="M9.6 15.2c0 1.325-1.075 2.4-2.4 2.4s-2.4-1.075-2.4-2.4c0-1.325 1.075-2.4 2.4-2.4s2.4 1.075 2.4 2.4z"></path>
      <path d="M14.4 8.8c0 1.325-1.075 2.4-2.4 2.4s-2.4-1.075-2.4-2.4c0-1.325 1.075-2.4 2.4-2.4s2.4 1.075 2.4 2.4z"></path>
      <path d="M22.4 8.8c0 1.325-1.075 2.4-2.4 2.4s-2.4-1.075-2.4-2.4c0-1.325 1.075-2.4 2.4-2.4s2.4 1.075 2.4 2.4z"></path>
      <path d="M27.2 15.2c0 1.325-1.075 2.4-2.4 2.4s-2.4-1.075-2.4-2.4c0-1.325 1.075-2.4 2.4-2.4s2.4 1.075 2.4 2.4z"></path>
    </symbol>
    <symbol id="vditor-icon-help" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M14.4 25.6h3.2v-3.2h-3.2v3.2zM16 0c-8.832 0-16 7.168-16 16s7.168 16 16 16 16-7.168 16-16-7.168-16-16-16zM16 28.8c-7.056 0-12.8-5.744-12.8-12.8s5.744-12.8 12.8-12.8 12.8 5.744 12.8 12.8-5.744 12.8-12.8 12.8zM16 6.4c-3.536 0-6.4 2.864-6.4 6.4h3.2c0-1.76 1.44-3.2 3.2-3.2s3.2 1.44 3.2 3.2c0 3.2-4.8 2.8-4.8 8h3.2c0-3.6 4.8-4 4.8-8 0-3.536-2.864-6.4-6.4-6.4z"></path>
    </symbol>
    <symbol id="vditor-icon-info" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M14.4 8h3.2v3.2h-3.2zM14.4 14.4h3.2v9.6h-3.2zM16 0c-8.832 0-16 7.168-16 16s7.168 16 16 16 16-7.168 16-16-7.168-16-16-16zM16 28.8c-7.056 0-12.8-5.744-12.8-12.8s5.744-12.8 12.8-12.8 12.8 5.744 12.8 12.8-5.744 12.8-12.8 12.8z"></path>
    </symbol>
    <symbol id="vditor-icon-fullscreen" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" x2="14" y1="3" y2="10"/><line x1="3" x2="10" y1="21" y2="14"/>  
    </symbol>
    <symbol id="vditor-icon-preview" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>  
    </symbol>
    <symbol id="vditor-icon-record" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M24.928 15.17h2.844q0 4.267-2.963 7.467t-7.151 3.832v5.531h-3.319v-5.531q-4.188-0.632-7.151-3.832t-2.963-7.467h2.844q0 3.714 2.647 6.123t6.281 2.41 6.281-2.41 2.647-6.123zM13.946 4.899v10.43q0 0.79 0.593 1.383t1.462 0.593q0.79 0 1.383-0.553t0.593-1.422l0.079-10.43q0-0.869-0.632-1.462t-1.422-0.593-1.422 0.593-0.632 1.462zM16 20.227q-2.054 0-3.556-1.501t-1.501-3.556v-10.114q0-2.054 1.501-3.556t3.556-1.501 3.556 1.501 1.501 3.556v10.114q0 2.054-1.501 3.556t-3.556 1.501z"></path>
    </symbol>
    <symbol id="vditor-icon-pause" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M20.617 0h9.128v32h-9.128v-32zM2.255 32v-32h9.128v32h-9.128z"></path>
    </symbol>
    <symbol id="vditor-icon-play" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M3.436 0l25.128 16-25.128 16v-32z"></path>
    </symbol>
    <symbol id="vditor-icon-emoji" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/>
    </symbol>
    <symbol id="vditor-icon-link" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>  
    </symbol>
    <symbol id="vditor-icon-redo" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/>  
    </symbol>
    <symbol id="vditor-icon-undo" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>  
    </symbol>
    <symbol id="vditor-icon-align-center" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M16 12H3"/><path d="M16 18H3"/><path d="M16 6H3"/><path d="M21 12h.01"/><path d="M21 18h.01"/><path d="M21 6h.01"/>  
    </symbol>
    <symbol id="vditor-icon-align-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M0 0h32v3.583h-32v-3.583zM0 32v-3.583h32v3.583h-32zM0 17.75v-3.5h32v3.5h-32zM21.333 7.083v3.583h-21.333v-3.583h21.333zM21.333 21.333v3.583h-21.333v-3.583h21.333z"></path>
    </symbol>
    <symbol id="vditor-icon-align-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M0 0h32v3.583h-32v-3.583zM10.667 10.667v-3.583h21.333v3.583h-21.333zM0 17.75v-3.5h32v3.5h-32zM10.667 24.917v-3.583h21.333v3.583h-21.333zM0 32v-3.583h32v3.583h-32z"></path>
    </symbol>
    <symbol id="vditor-icon-bold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path xmlns="http://www.w3.org/2000/svg" d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"/>
    </symbol>
    <symbol id="vditor-icon-indent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M21 12H11"/><path d="M21 18H11"/><path d="M21 6H11"/><path d="m3 8 4 4-4 4"/>  
    </symbol>
    <symbol id="vditor-icon-outdent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M21 12H11"/><path d="M21 18H11"/><path d="M21 6H11"/><path d="m7 8-4 4 4 4"/>  
    </symbol>
    <symbol id="vditor-icon-italic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/>
    </symbol>
    <symbol id="vditor-icon-list" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M3 12h.01"/><path d="M3 18h.01"/><path d="M3 6h.01"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M8 6h13"/>  
    </symbol>
    <symbol id="vditor-icon-ordered-list" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M10 12h11"/><path d="M10 18h11"/><path d="M10 6h11"/><path d="M4 10h2"/><path d="M4 6h1v4"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>  
    </symbol>
    <symbol id="vditor-icon-mp-wechat" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M6.927 17.719s-3.040-3.431-2.915-6.942c0.16-4.453 4.738-10.257 11.359-10.257 1.884 0 5.653 0 10.328 5.52 0.249 0.302-15.075-3.84-18.772 11.679z"></path>
      <path d="M17.477 9.301s3.946-1.298 7.271-0.178c4.222 1.422 8.693 6.826 6.809 13.182-0.533 1.804-1.609 5.413-8.231 8.32-0.356 0.16 10.613-13.351-5.849-21.323z"></path>
      <path d="M10.944 24.332c-1.938 2.035-3.751 1.742-3.751 1.742l0.578-3.191c-5.235-3.44-6.373-10.328-6.453-10.106-2.444 6.817-0.916 11.377 0.027 13.004 3.315 5.733 11.982 7.351 17.484 3.893 2.969-1.867 4.533-7.057 4.533-7.057-5.298 2.338-9.342 2.569-12.417 1.715z"></path>
    </symbol>
    <symbol id="vditor-icon-zhihu" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M17.167 17.769s0-2.583-1.25-2.667c-1.25-0.167-5.167 0-5.167 0v-8h5.833s-0.083-2.667-1.167-2.667h-9.5l1.583-4.25s-2.333 0.167-3.25 1.667c-0.833 1.5-3.5 9.167-3.5 9.167s0.917 0.417 2.417-0.75c1.5-1.083 2-3.083 2-3.083l2.75-0.167 0.083 8.083s-4.917-0.083-5.833 0c-1 0.083-1.5 2.667-1.5 2.667h7.417s-0.667 4.583-2.5 7.75c-1.917 3.333-5.583 5.917-5.583 5.917s2.583 1.083 5.167-0.417 4.417-8.083 4.417-8.083l5.917 7.417s0.5-3.5-0.083-4.583c-0.667-1-4.167-5-4.167-5l-1.5 1.333 1.083-4.417 6.333 0.083zM18.667 4.269l-0.083 23.999h2.417l0.833 2.917 4.25-2.917h5.917v-23.999h-13.333zM29.333 25.602h-2.75l-3.5 2.667-0.75-2.667h-0.75v-18.582h7.75v18.582z"></path>
    </symbol>
    <symbol id="vditor-icon-list-plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M11 12H3"/><path d="M16 6H3"/><path d="M16 18H3"/><path d="M18 9v6"/><path d="M21 12h-6"/>  
    </symbol>
    <symbol id="vditor-icon-translation" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/>
    </symbol>
    <symbol id="vditor-icon-question" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>  
    </symbol>
    <symbol id="vditor-icon-sync" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M12 13v8"/><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="m8 17 4-4 4 4"/>  
    </symbol>
    <symbol id="vditor-icon-history" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>  
    </symbol>
    <symbol id="vditor-icon-polish" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 11a2 2 0 0 0 4 0 4 4 0 0 0-8 0 6 6 0 0 0 12 0"/>
    </symbol>
    <symbol id="vditor-icon-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide">
      <path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/>
    </symbol>
  </defs>
</svg>`)
