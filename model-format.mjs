export function plyKind(buffer){
 const header=new TextDecoder().decode(buffer.slice(0,Math.min(buffer.byteLength,65536)));
 if(!header.startsWith('ply')||!header.includes('end_header'))throw Error('PLY header is damaged or incomplete');
 const h=header.slice(0,header.indexOf('end_header'));
 const names=[...h.matchAll(/^property\s+\w+\s+(\w+)\s*$/gm)].map(m=>m[1]);
 const needed=['opacity','scale_0','scale_1','scale_2','rot_0','rot_1','rot_2','rot_3','f_dc_0','f_dc_1','f_dc_2'];
 if(needed.every(x=>names.includes(x)))return 'gaussian';
 if(names.some(x=>/^(scale_|rot_|f_dc_|opacity$)/.test(x)))throw Error('Incomplete Gaussian attributes detected; cannot safely display as ordinary points');
 return 'points';
}
export const MAX_MODEL_BYTES=64*1024*1024;
