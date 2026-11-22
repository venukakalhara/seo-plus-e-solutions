const routes = [
 'M-20 65 C75 65 40 150 130 150 S200 250 320 250',
 'M-20 270 C65 270 65 220 130 220 S215 270 320 270',
 'M-20 455 C75 455 40 350 130 350 S205 290 320 290',
 'M35 -20 C35 90 190 70 190 160 S240 240 320 250',
];

/** Decorative SVG only: no network requests, timers or interaction interception. */
export function ConnectionAnimation() {
 return <div className="connection-animation" aria-hidden="true">
  {['left','right'].map(side=><div className={`connection-wing connection-${side}`} key={side}>
   <svg viewBox="0 0 340 520" fill="none" focusable="false">
    {routes.map((route,i)=><g key={route} className={`connection-route connection-route-${i}`}>
     <path d={route} className="connection-track"/>
     <path d={route} pathLength="100" className="connection-pulse"/>
    </g>)}
    {[[35,65],[130,150],[130,220],[130,350],[190,160],[54,420]].map(([x,y],i)=><g key={i} className={`connection-node connection-node-${i}`}>
     <circle cx={x} cy={y} r="10" className="connection-halo"/>
     <circle cx={x} cy={y} r="3" fill="#efce79"/>
    </g>)}
   </svg>
  </div>)}
 </div>;
}
