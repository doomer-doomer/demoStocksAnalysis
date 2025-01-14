"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { NextUIProvider } from '@nextui-org/react';
import { Grid, Switch } from "@nextui-org/react";
import { SunIcon } from './sun';
import { MoonIcon } from './moon';

import { createTheme } from "@nextui-org/react"
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useTheme as useNextTheme } from 'next-themes'
import {Dropdown} from "@nextui-org/react"
import { styled } from '@mui/material/styles';
import { Avatar } from '@nextui-org/react';
import 'boxicons'
import { Navbar, Button, Text, Card, Radio, theme,Container, Row } from "@nextui-org/react";
import Link from 'next/link';
import '../src/app/stocks/screener/screener.css'
import { Slider } from '@mui/material';
import { DataGrid,GridToolbar } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import columns from './screener_columns';
import staticScreener from './staticScreener';


const lightTheme = createTheme({
    type: 'light',
    
  })
  
  const darkTheme = createTheme({
    type: 'dark',
    colors:{
      modes: {
        dark: {
          background: '#16181A', // Set your desired background color here
          // ... other dark theme configuration
        },
      },
    }
    
  })

export default function ScreenerComp(){

    const [isDark, setIsDark] = useState(false);
    const [load,setload] = useState(false)
    const [testtheme, testsetTheme] = useState('light');

    const mode = React.useRef(null);
    const [selectedSector, setSelectedSector] = React.useState(new Set(["All"]));
   

    const selectedValue = React.useMemo(
        () => Array.from(selectedSector).join(", ").replaceAll("_", " "),
        [selectedSector]
    );



    const [userData,setUserData]=useState({
        user_name:"",
        email:""
      })

    const [NSEData,setNSEData] = useState([])
    const [NSEData2,setNSEData2] = useState(NSEData)
    const [BSEData,setBSEData] = useState([])
    const [BSEData2,setBSEData2] = useState(BSEData)
    const [tempNSEData,tempsetNSEData] = useState([])
    const [tempBSEData,tempsetBSEData] = useState([])
    const [Filtered,setFiltered] = useState(true)

    const collapseItems = [
    "Features",
    "Customers",
    "Pricing",
    "Company",
    "Legal",
    "Team",
    "Help & Feedback",
    "Login",
    "Sign Up",
    ];

    async function Authenticate(){
        try {
          if (typeof window !== 'undefined') {
            const token = localStorage.getItem("sessionToken")
            const response = await fetch("http://localhost:5002/auth",{
                method:"POST",
                headers: { Authorization: `Bearer ${token}`,
                    sessionToken: token
                },
            })
      
            const res = await response.json();
            if(res==="Verified"){
                setload(true)
            }
          }
        } catch (error) {
            console.error(error.message)
        }
      }

      async function getUserData(){
        try {
          if (typeof window !== 'undefined') {
            const token = localStorage.getItem("sessionToken")
            const response = await fetch("http://localhost:5002/getData",{
                method:"POST",
                headers: { Authorization: `Bearer ${token}`,
                    sessionToken: token
                },
            })
      
            const res = await response.json();
            if(!response.ok){
              return alert("Not workin")
            }
            console.log(res.user_name)
            setUserData({...userData,
              user_name:res.map(abc=>abc.user_name.slice(0,1)),
              email:res.map(abc=>abc.email)
            })
            setload(true)
          }
        } catch (error) {
            console.error(error.message)
        }
      }

      const allNSEData = async()=>{
        await fetch("http://localhost:5000/getAllInfoNSE",{method:"GET"})
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Request failed:', response.status);
          }
        })
        .then(data => {
          const mappedData = Object.keys(data).map(stockSymbol => {
            const stockData = data[stockSymbol];
            return {
                symbol: stockSymbol,
                name: stockData.Name,
                price: stockData.Price,
                open: stockData.Open,
                high: stockData.High,
                low: stockData.Low,
                close: stockData.Close,
                volume: stockData.Volume,
                beta: stockData.Beta,
                exchange: stockData.Exchange,
                sector: stockData.Sector,
                Cap:stockData.marketCap,
                forwardPE:stockData.forwardPE,
                forwardEps:stockData.forwardEps,
                totalRevenue:stockData.totalRevenue,
                trailingEps:stockData.trailingEps,
                trailingPE:stockData.trailingPE
            };
          });
          let idCounter = 1;
          mappedData.forEach(stock => {
            stock.profit = stock.close - stock.price;
            stock.id = idCounter++;
          });
          
          const validStocks = mappedData.filter(stock => typeof stock.Cap === 'number' );
          console.log(validStocks)

          const losers = mappedData.filter(stock => stock.profit < 0);
          const gainers = mappedData.filter(stock => stock.profit >= 0);
          losers.sort((a, b) => a.profit - b.profit);
          gainers.sort((a, b) => b.profit - a.profit);
          const top10Losers = losers.slice(0, 10);
          const top10Gainers = gainers.slice(0, 10);
          const mergedData = top10Gainers.concat(top10Losers);
          
          console.log("Top 10 Highest Profit Stocks:");
          console.log(gainers);

          const uniqueSectors = [...new Set(mappedData.map(stock => stock.sector))];
          console.log(uniqueSectors)
          setNSEData(mappedData)
          tempsetNSEData(mappedData)
          setNSEData2(mappedData)
          console.log(mappedData)

          const highestVolumeStock = mappedData.reduce((prev, current) => {
            return (prev.profit > current.profit) ? prev : current;
          });
          const lowestVolumeStock = mappedData.reduce((prev, current) => {
            return (prev.profit < current.profit) ? prev : current;
          });

          console.log(highestVolumeStock)

          setHigestP(highestVolumeStock.profit)
          setlowestP(lowestVolumeStock.profit)
          if (validStocks.length > 0) {
            const highestCapStock = validStocks.reduce((prev, current) => {
                return (prev.Cap > current.Cap) ? prev : current;
            });

            const lowestCapStock= validStocks.reduce((prev, current) => {
                return (prev.Cap > current.Cap) ? prev : current;
            });
            console.log(highestCapStock)
            console.log(lowestCapStock)
        }else{
            console.log("No")
        }

        
          
          
        })
        .catch(error => {
          console.error('Error:', error);
        });
       }
      
       const allBSEData = async()=>{
        await fetch("http://localhost:5000/getAllInfoBSE",{method:"GET"})
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Request failed:', response.status);
          }
        })
        .then(data => {
          const mappedData = Object.keys(data).map(stockSymbol => {
            const stockData = data[stockSymbol];
            return {
              symbol: stockSymbol,
              name: stockData.Name,
              price: stockData.Price,
              open: stockData.Open,
              high: stockData.High,
              low: stockData.Low,
              close: stockData.Close,
              volume: stockData.Volume,
              beta: stockData.Beta,
              exchange: stockData.Exchange,
              sector: stockData.Sector
            };
          });
          let idCounter = 1;
          mappedData.forEach(stock => {
            stock.profit = stock.close - stock.price;
            stock.id = idCounter++;
          });
          const losers = mappedData.filter(stock => stock.profit < 0);
          const gainers = mappedData.filter(stock => stock.profit >= 0);
          losers.sort((a, b) => a.profit - b.profit);
          gainers.sort((a, b) => b.profit - a.profit);
          const top10Losers = losers.slice(0, 10);
          const top10Gainers = gainers.slice(0, 10);
          const mergedData = top10Gainers.concat(top10Losers);
          const uniqueSectors = [...new Set(mappedData.map(stock => stock.sector))];
          console.log(uniqueSectors)
          console.log("Top 10 Highest Profit Stocks:");
          console.log(gainers);
          setBSEData(mappedData)
          tempsetBSEData(mappedData)
          setBSEData2(mappedData)
          
        })
        .catch(error => {
          console.error('Error:', error);
        });
       }
      

    useEffect(()=>{
        // allNSEData()
        // allBSEData()
    },[])

    useEffect(()=>{
      if (typeof window !== 'undefined') {
        if(localStorage.getItem("theme")==="true"){
            setIsDark(true)
          }else if(localStorage.getItem("theme")==="false"){
            setIsDark(false)
          }else{
            return
          }
      }

      if (typeof window !== 'undefined') {
          if(localStorage.getItem("sessionToken")!=="" ){
            Authenticate()
            getUserData()
           
          }else{
            return
          }
        }
          
    },[isDark,Filtered]);
    
    return(
        
            <NextThemesProvider
                defaultTheme="system"
                attribute="class"
                value={{
                    light: lightTheme.className,
                    dark: darkTheme.className
                }}
                >
      <NextUIProvider theme={isDark ? darkTheme : lightTheme}>

        {/* <div className="screener-nav">
        
                <Switch
                checked={!isDark}
                onChange={(e) => testsetTheme(e.target.checked ? 
                    abc=>
                    {setIsDark(false)
                    localStorage.setItem("theme",false)
                    } : 
                    abc=>
                    {setIsDark(true)
                    localStorage.setItem("theme",true)
                    })}
                size="xl"
                iconOn={<SunIcon filled />}
                iconOff={<MoonIcon filled />}
                />
               
        </div> */}
        <div className='screener-content'>
            
                    <div className='screnner-layout'>
                        <div className='screener-setting'>
                          
                            {/* <h2>Options</h2>
                            <div className='screener-options'>
                                <h5 style={{marginTop:"7px"}}>Exchange: </h5>
                                <Button.Group color="primary" size='sm'>
                                    <Button bordered={!Filtered} onClick={abc=>setFiltered(true)}>NSE</Button>
                                    <Button bordered={Filtered} onClick={abc=>setFiltered(false)}>BSE</Button>
                                </Button.Group>
                                <h5 style={{marginTop:"2px"}}>Sector : </h5>
                                <Dropdown>
                                    <Dropdown.Button size="sm" bordered flat color="primary" css={{ tt: "capitalize" }}>
                                        {selectedValue}
                                    </Dropdown.Button>
                                    <Dropdown.Menu
                                        aria-label="Single selection actions"
                                        css={{ maxHeight: "300px" }}
                                        color="default"
                                        disallowEmptySelection
                                        selectionMode="single"
                                        selectedKeys={selectedSector}
                                        onSelectionChange={setSelectedSector}
                                    >
                                        <Dropdown.Item key="all"><Button light auto color="default" onClick={abc=>{
                                          setNSEData(NSEData2)
                                          setBSEData(BSEData2)
                                          tempsetNSEData(NSEData2) 
                                          tempsetBSEData(BSEData2)
                                          }}>All</Button></Dropdown.Item>
                                        <Dropdown.Item key="Basic Materials"><Button light auto color="default" onClick={abc=>{
                                          
                                          const filtteredNSE =NSEData.filter(item=>item.sector ==="Basic Materials");
                                          const filtteredBSE =BSEData.filter(item=>item.sector ==="Basic Materials"); 
                                          tempsetNSEData(filtteredNSE)
                                          tempsetBSEData(filtteredBSE)
                                          }}>Basic Materials</Button></Dropdown.Item>
                                        <Dropdown.Item key="Financial Services"><Button light auto color="default" onClick={abc=>{
                                          const filtteredNSE =NSEData.filter(item=>item.sector ==="Financial Services");
                                          const filtteredBSE =BSEData.filter(item=>item.sector ==="Financial Services"); 
                                          tempsetNSEData(filtteredNSE)
                                          tempsetBSEData(filtteredBSE)
                                          }}>Financial Services</Button></Dropdown.Item>
                                        <Dropdown.Item key="Technology"><Button light auto color="default" onClick={abc=>{
                                          const filtteredNSE =NSEData.filter(item=>item.sector ==="Technology");
                                          const filtteredBSE =BSEData.filter(item=>item.sector ==="Technology"); 
                                          tempsetNSEData(filtteredNSE)
                                          tempsetBSEData(filtteredBSE)
                                          }}>Technology</Button></Dropdown.Item>
                                        <Dropdown.Item key="Industrials"><Button light auto color="default" onClick={abc=>{
                                          const filtteredNSE =NSEData.filter(item=>item.sector ==="Industrials");
                                          const filtteredBSE =BSEData.filter(item=>item.sector ==="Industrials"); 
                                          tempsetNSEData(filtteredNSE)
                                          tempsetBSEData(filtteredBSE)
                                          }}>Industrials</Button></Dropdown.Item>
                                        <Dropdown.Item key="Energy"><Button light auto color="default" onClick={abc=>{
                                          const filtteredNSE =NSEData.filter(item=>item.sector ==="Energy");
                                          const filtteredBSE =BSEData.filter(item=>item.sector ==="Energy"); 
                                          tempsetNSEData(filtteredNSE)
                                          tempsetBSEData(filtteredBSE)
                                          }}>Energy</Button></Dropdown.Item>
                                        <Dropdown.Item key="Healthcare"><Button light auto color="default" onClick={abc=>{
                                          const filtteredNSE =NSEData.filter(item=>item.sector ==="Healthcare");
                                          const filtteredBSE =BSEData.filter(item=>item.sector ==="Healthcare"); 
                                          tempsetNSEData(filtteredNSE)
                                          tempsetBSEData(filtteredBSE)
                                          }}>Healthcare</Button></Dropdown.Item>
                                        <Dropdown.Item key="Consumer Cyclical"><Button light auto color="default" onClick={abc=>{
                                          const filtteredNSE =NSEData.filter(item=>item.sector ==="Consumer Cyclical");
                                          const filtteredBSE =BSEData.filter(item=>item.sector ==="Consumer Cyclical"); 
                                          tempsetNSEData(filtteredNSE)
                                          tempsetBSEData(filtteredBSE)
                                          }}>Consumer Cyclical</Button></Dropdown.Item>
                                        <Dropdown.Item key="Utilities"><Button light auto color="default" onClick={abc=>{
                                          const filtteredNSE =NSEData.filter(item=>item.sector ==="Utilities");
                                          const filtteredBSE =BSEData.filter(item=>item.sector ==="Utilities"); 
                                          tempsetNSEData(filtteredNSE)
                                          tempsetBSEData(filtteredBSE)
                                          }}>Utilities</Button></Dropdown.Item>
                                        <Dropdown.Item key="Consumer Defensive"><Button light auto color="default" onClick={abc=>{
                                          const filtteredNSE =NSEData.filter(item=>item.sector ==="Consumer Defensive");
                                          const filtteredBSE =BSEData.filter(item=>item.sector ==="Consumer Defensive"); 
                                          tempsetNSEData(filtteredNSE)
                                          tempsetBSEData(filtteredBSE)
                                          }}>Consumer Defensive</Button></Dropdown.Item>
                                        <Dropdown.Item key="Communication Services"><Button light auto color="default" onClick={abc=>{
                                          const filtteredNSE =NSEData.filter(item=>item.sector ==="Communication Services");
                                          const filtteredBSE =BSEData.filter(item=>item.sector ==="Communication Services"); 
                                          tempsetNSEData(filtteredNSE)
                                          tempsetBSEData(filtteredBSE)
                                          }}>Communication Services</Button></Dropdown.Item>
                                        <Dropdown.Item key="Real Estate"><Button light auto color="default" onClick={abc=>{
                                          const filtteredNSE =NSEData.filter(item=>item.sector ==="Real Estate");
                                          const filtteredBSE =BSEData.filter(item=>item.sector ==="Real Estate"); 
                                          tempsetNSEData(filtteredNSE)
                                          tempsetBSEData(filtteredBSE)
                                          }}>Real Estate</Button></Dropdown.Item>
                                      
                                    </Dropdown.Menu>
                                </Dropdown>
                                
                            </div> */}
                            
                        
                        </div>
                        
                        <div className='screener-layout'>
                        <h1>Screener</h1>
                            <h3>Filtered Stocks: {Filtered ?tempNSEData.length : tempBSEData.length}</h3>
                            <Box sx={{ height: "70vh", width: '95%',color:isDark?"white":"black" }} >
                                <DataGrid
                                    rows={staticScreener.sort()}
                                    columns={columns}
                                    initialState={{
                                    pagination: {
                                        paginationModel: {
                                        pageSize: 100,
                                        
                                        },
                                    },
                                    }}
                                    sx={{
                                        color:isDark?"white":"black"
                                    }}
                                   
                                    pageSizeOptions={[5,10, 25,100]}
                                    slots={{ toolbar: GridToolbar }}
                                    disableRowSelectionOnClick
                                />
                            </Box>
                        </div>

                    </div>
        </div>

      </NextUIProvider>
            
        </NextThemesProvider>
    )
}