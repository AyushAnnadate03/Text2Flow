import React from 'react'
export default function Footer(){
  return (
    <footer style={{padding:20,marginTop:70,background:'#0b1220',color:'#cbd5e1',textAlign:'center'}}>
      <div>© {new Date().getFullYear()} Text2Flow — Convert text into flowcharts instantly.</div>
      <div style={{marginTop:6,fontSize:13}}>Made for education & rapid prototyping.</div>
    </footer>
  )
}
