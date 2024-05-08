"use client"

import Image from 'next/image';
import Up from '../src/app/stocks/[data]/arrow-up.png';
import Down from '../src/app/stocks/[data]/down.png';
import 'boxicons'
import { Children, useState } from "react";
import { useRouter } from "next/navigation";
import '../css/customTable.css';
import zIndex from '@mui/material/styles/zIndex';

export default function CustomTable(props){
    const router = useRouter();

    const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

    function teleport(e){
        router.push(`stocks/${e}`)
    }
    return (
        
        <div className='static'
          style={{
            width:'90%',
            display: 'flex',
            justifyContent: 'space-between',
            border: 'none',
            color: props.isDark ? (isHovered ? "#FFFFFF" : "#16181A") : (isHovered ? "#16181A" : "#FFFFFF"),
            borderRadius: '10px',
            backgroundColor: props.isDark ? (isHovered ? "#16181A" : "#FFFFFF") : (isHovered ? "#FFFFFF" : "#16181A"),
            transition: 'background-color 0.3s',
            padding: '10px',
            margin: '10px',
            overflow: 'hidden',
            zIndex: 0,
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div>
            <p style={{ zIndex:4,marginLeft: '10px' }} onMouseEnter={handleMouseEnter}>{Children.count(props.profit)} {props.name}</p>
          </div>
          <div></div>
          <div style={{ display: 'flex', marginRight: '10px' }}>
            <Image src={props.profit >= 0 ? Up : Down} width={25} height={25} alt="abc" />
            <p style={{ marginLeft: '10px', marginRight: '10px' }}>{(props.price).toLocaleString('en-US')} ({(props.profit).toFixed(2)})</p>
            <box-icon style={{zIndex:4}}  name='link-external' color={props.isDark ? "#16181A" : "#FFFFFF"} onClick={abc => teleport(props.symbol)}></box-icon>
          </div>
        </div>
   
      
       
    )
}