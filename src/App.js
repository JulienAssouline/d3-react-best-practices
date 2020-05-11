import React from "react";
import { Deck, Slide, Heading, Text, Quote, CodePane, Image } from "spectacle";
import { TwitterTweetEmbed } from "react-twitter-embed";

import contourImage from "./images/contourImage.png";
import fieldImage from "./images/fieldImage.png";
import hexbinImage from "./images/hexbinImage.png";
import zoneImage from "./images/zoneImage.png";
import d3Home from "./images/d3Home.png";
import zoneSpray from "./images/zoneSpray.png";
import strikezone from "./images/strikezone.png";
import recharts from "./images/recharts.png";
import victoryjs from "./images/victoryjs.png";
import nivo from "./images/nivo.png";
import vx from "./images/vx.png";
import duotoneDark from "prism-react-renderer/themes/nightOwlLight";

function App() {
  return (
    <Deck progress="pacman" transitionEffect="slide">
      <Slide id="1">
        <Heading>D3 + React Best Practices</Heading>
        <Text>By: Julien Assouline</Text>
        <Text>Currently, I'm a developer for the Toronto Blue Jays</Text>
        <Text>I Like React and ❤️ D3</Text>
      </Slide>
      <Slide id="1">
        <div>
          <Image
            src={contourImage}
            width={300}
            height={300}
            alt="contourImage"
          />
          <Image src={fieldImage} width={300} height={300} alt="fieldImage" />
          <Image src={hexbinImage} width={300} height={300} alt="hexbinImage" />
          <Image src={zoneImage} width={300} height={300} alt="zoneImage" />
          <Image src={zoneSpray} width={400} height={300} alt="zoneImage" />
          <Image src={strikezone} width={400} height={300} alt="zoneImage" />
        </div>
      </Slide>
      <Slide id="2">
        <Heading>What is D3?</Heading>
        <Image src={d3Home} alt="zoneImage" />
      </Slide>
      <Slide id="2">
        <Heading>We don't need all of D3</Heading>
        <Quote>
          "D3 isn’t a monolithic framework; it’s a suite of small modules
          (thirty-one and counting) for data analysis and visualization. These
          modules work well together, but you should pick and choose the parts
          you need" - Mike Bostock
        </Quote>
      </Slide>
      <Slide id="4">
        <Heading>Okay... so how does that work with React?</Heading>
        <CodePane
          autoFillHeight={true}
          language="javascript"
          theme={duotoneDark}
        >
          {`
            function RandomData() {
              const data = [...Array(100)].map((e, i) => {
                return {
                  x: Math.random() * 40,
                  y: Math.random() * 40,
                  temparature: Math.random() * 500
                };
              });
              return data;
            }
            
            export default function App() {
              const data = RandomData();
            
              const ref = useRef(null);
            
              const w = 600,
                h = 600,
                margin = {
                  top: 40,
                  bottom: 40,
                  left: 40,
                  right: 40
                };
            
              const width = w - margin.right - margin.left,
                height = h - margin.top - margin.bottom;
            
              useEffect(() => {
                const g = select(ref.current);
            
                const xScale = scaleLinear()
                .domain(extent(data, d => d.x))
                .range([0, width]);
            
              const yScale = scaleLinear()
                .domain(extent(data, d => d.y))
                .range([height, 0]);
            
                g.selectAll(".circles")
                .data(data)
                .enter()
                .append("circle")
                .attr("r", 3)
                .attr("cx", d => xScale(d.x))
                .attr("cy", d => yScale(d.y))
                .attr("fill", "black")
              }, [data, height, width]);
            
              return (
                <div className="App">
                  <svg width={w} height={h}>
                    <g ref={ref} transform={translate(margin.left,margin.top)} />
                  </svg>
                </div>
              );
            }
            
          `}
        </CodePane>
      </Slide>
      <Slide id="6">
        <Heading>Why is this bad?</Heading>
        <Text>The code is less readable</Text>
        <Text>It's less reusable</Text>
        <Text>And it can lead to performance issues</Text>
      </Slide>
      <Slide id="7">
        <Heading>Let's look at an example</Heading>
        <TwitterTweetEmbed tweetId={"1251854168584867840"} />
        <blockquote class="twitter-tweet"></blockquote>
      </Slide>
      <Slide id="8">
        <Heading>We can make this better... it's not Reacts fault</Heading>
      </Slide>
      <Slide id="9">
        <Heading>What was the the difference?</Heading>
        <Text>React renders</Text>
        <Text>D3 does the math</Text>
      </Slide>
      <Slide id="10">
        <Heading>What that looks like</Heading>
        <CodePane
          autoFillHeight={true}
          language="javascript"
          theme={duotoneDark}
        >
          {`
 import React, { useMemo } from "react";
 import { line, area } from "d3-shape";
 import { extent } from "d3-array";
 import { scaleLinear, scaleTime } from "d3-scale";
 import { timeParse } from "d3-time-format";
 import AxisLeft from "./AxisLeft";
 import AxisBottom from "./AxisBottom";
 import LinearGradient from "./LinearGradient";
 import Tooltip from "./Tooltip";
 
 import { statesLabels } from "./utils/helpers";
 
 function SmallMultipleContainer({ data }) {
   const w = 500,
     h = 260;
 
   const margin = {
     top: 40,
     left: 40,
     right: 40,
     bottom: 40,
   };
 
   const width = w - margin.right - margin.left,
     height = h - margin.top - margin.bottom;
 
   const parseTime = timeParse("%Y-%m-%d");
 
   function sortByState(a, b) {
     if (a.i < b.i) {
       return -1;
     }
     if (a.i > b.i) {
       return 1;
     }
     return 0;
   }
 
   useMemo(() => data.sort(sortByState), [data]);
 
   const xScale = scaleTime()
     .domain([
       new Date("March 02 2020"),
       extent(data[0]["r0"], (el) => parseTime(el.d))[1],
     ])
     .range([0, width - 5]);
 
   const yScale = scaleLinear().domain([0, 4.5]).range([height, 0]);
 
   const path = useMemo(
     () =>
       line()
         .x((el) => {
           return xScale(parseTime(el.d));
         })
         .y((el) => yScale(el.c["r0"])),
     [parseTime, xScale, yScale]
   );
 
   const pathArea = useMemo(
     () =>
       area()
         .x((el) => xScale(parseTime(el.d)))
         .y0((d) => yScale(d.c["l90"]))
         .y1((d) => yScale(d.c["h90"])),
     [parseTime, xScale, yScale]
   );
 
   const lineCharts = data.map((d, i) => (
     <svg id="tooltip" key={i} width={w} height={h}>
       <g transform={"translate(margin.left,"+"margin.top)"}>
         <text style={{ fontWeight: "bold" }} x={0} y={-20}>
           {statesLabels[i]}
         </text>
         <text x={width - 30} y={-20}>
           {d["r0"][d["r0"].length - 1].c["r0"].toFixed(2)}
         </text>
         <AxisLeft yScale={yScale} width={width} count={5} />
         <AxisBottom xScale={xScale} height={height} />
         <LinearGradient state={d.i} height={height} yScale={yScale} />
         <path
           d={pathArea(d["r0"])}
           style={{
             fill: "url(#states-"+"d.i)",
             stroke: "url(#states-"+"d.i)",
             strokeWidth: 3,
             opacity: 0.08,
           }}
         />
         <path
           d={path(d["r0"])}
           style={{
             fill: "none",
             stroke: "url(#states" + "-d.i)",
             strokeWidth: 1.5,
           }}
         />
         <Tooltip
           width={width}
           height={height}
           xScale={xScale}
           data={d["r0"]}
           parseTime={parseTime}
         />
         <rect
           x={0}
           y={0}
           width={width}
           height={height}
           style={{ opacity: 1, fill: "none", stroke: "#eee" }}
         />
       </g>
     </svg>
   ));
 
   return <div>{lineCharts}</div>;
 }
 
 export default SmallMultipleContainer;
 
            
          `}
        </CodePane>
      </Slide>
      <Slide id="12">
        <Heading>Be careful/mindful of your imports</Heading>
        <Text>Never import all of D3! (import * as d3 from D3)</Text>
        <CodePane
          autoFillHeight={true}
          language="javascript"
          theme={duotoneDark}
        >
          {`
 import React, { useMemo } from "react";
 import { line, area } from "d3-shape";
 import { extent } from "d3-array";
 import { scaleLinear, scaleTime } from "d3-scale";
 import { timeParse } from "d3-time-format"; 
            
          `}
        </CodePane>
      </Slide>
      <Slide id="13">
        <Heading>Animations</Heading>
        <Text>
          You're in React land... think of solutions with the React ecosystem
        </Text>
        <Text>Framer Motion</Text>
        <Text>React Spring</Text>
      </Slide>
      <Slide id="14">
        <Heading>So when should I use D3?</Heading>
        <div>
          <Image src={victoryjs} width={300} height={300} alt="contourImage" />
          <Image src={recharts} alt="contourImage" />
          <Image src={nivo} alt="contourImage" />
          <Image src={vx} alt="contourImage" />
        </div>
      </Slide>
      <Slide id="15">
        <Heading>Thank you ❤️ </Heading>
      </Slide>
    </Deck>
  );
}
export default App;
