import React from "react";
import {
  Deck,
  Slide,
  Heading,
  Text,
  Quote,
  CodePane,
  Image,
  Link,
  Progress,
  FlexBox,
  Box,
  FullScreen,
  Appear,
} from "spectacle";
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
import Axis from "./images/Axis.png";
import rtlive from "./images/rtlive.png";
import lineCharts from "./images/lineChart.png";

import duotoneDark from "prism-react-renderer/themes/nightOwl";

const template = () => (
  <FlexBox margin={10} position="absolute" bottom={0} width={1}>
    <Box marginRight="auto">
      <FullScreen />
    </Box>
    <Box marginRight="auto">
      <Progress />
    </Box>
  </FlexBox>
);

function App() {
  return (
    <Deck transition={["slide"]} template={template}>
      <Slide id="1">
        <Heading>D3 + React Best Practices</Heading>
        <Text>By: Julien Assouline</Text>
        <Text>Currently, I'm a developer for the Toronto Blue Jays</Text>
        <Text>Previously, interened at Flourish & CBC </Text>
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
        <CodePane autoFillHeight={true} language="jsx" theme={duotoneDark}>
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
        <Text>It can lead to performance issues</Text>
        <Text>And it can't work in React Native</Text>
      </Slide>
      <Slide id="7">
        <Heading>Let's look at an example</Heading>

        <FlexBox>
          <TwitterTweetEmbed tweetId={"1251854168584867840"} />
          <blockquote class="twitter-tweet"></blockquote>
          <Image src={rtlive} width={500} height={300} />
        </FlexBox>
      </Slide>
      <Slide id="9">
        <Heading>The Better Way</Heading>
        <Text>React renders</Text>
        <Text>D3 does the math</Text>
      </Slide>
      <Slide id="10">
        <Heading>The D3/JS code</Heading>

        <CodePane autoFillHeight={true} language="jsx" theme={duotoneDark}>
          {`
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

          
          `}
        </CodePane>
      </Slide>
      <Slide id="10">
        <Heading>React Rendering</Heading>
        <CodePane autoFillHeight={true} language="jsx" theme={duotoneDark}>
          {`
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
          `}
        </CodePane>
      </Slide>
      <Slide id="12">
        <Heading>Reusable Pattern</Heading>

        <CodePane autoFillHeight={true} language="jsx" theme={duotoneDark}>
          {`
 const lineCharts = data.map((d, i) => (
  <LineChart w={w} h={h} margin={margin}>

            <Text
                  textLabel={statesLabels[i]}
                  x={0}
                  y={-20}
                  styles={{ fontWeight: "bold" }}
            />
            <Text
                  textLabel={d["r0"][d["r0"].length - 1].c["r0"].toFixed(2)}
                  x={width - 30}
                  y={-20}
                  styles={{ fontWeight: "bold" }}
            />

            <AxisLeft yScale={yScale} width={width} count={5} />
            <AxisBottom xScale={xScale} height={height} />

            <LinearGradient state={d.i} height={height} yScale={yScale} />

            <Path
                  pathFun={pathArea(d["r0"])}
                  styles={{
                    fill: url(#states-d.i),
                    stroke: url(#states-d.i),
                    strokeWidth: 3,
                    opacity: 0.08,
                  }}
            />
            <Path
                  pathFun={path(d["r0"])}
                  styles={{
                    fill: "none",
                    stroke: url(#states-d.i),
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

            <Rect
                  x={0}
                  y={0}
                  width={width}
                  height={height}
                  styles={{ opacity: 1, fill: "none", stroke: "#eee" }}
            />
  </LineChart>
));
            
          `}
        </CodePane>
      </Slide>
      <Slide id="12">
        <Image src={lineCharts} width={1300} height={600} alt={"lineCharts"} />
      </Slide>
      <Slide id="12">
        <Heading>Be careful/mindful of your imports</Heading>
        <Text>Never import all of D3! (import * as d3 from d3)</Text>
        <CodePane language="jsx" theme={duotoneDark}>
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
        <Heading>Axes</Heading>
        <Appear
          elementNum={0}
          transitionEffect={{ to: { opacity: 0 }, from: { opacity: 1 } }}
        >
          <CodePane autoFillHeight={true} language="jsx" theme={duotoneDark}>
            {`
        function AxisLeft({ yScale, width, count }) {

          const textPadding = -20;
        
          const axis = yScale.ticks(count).map((d, i) => (

            <g key={i} className="y-tick">

            <line
              style={{
                stroke: "lightgrey",
                opacity: 0.5
              }}
              y1={yScale(d)}
              y2={yScale(d)}
              x1={0}
              x2={width}
            />

              <text
                style={{ fontSize: 12, fill: "#c5c5c5" }}
                x={textPadding}
                dy=".32em"
                y={yScale(d)}
              >
                {d}
              </text>
              
            </g>

          ));
          return <>{axis}</>;
        }
             
          `}
          </CodePane>
        </Appear>
        <Appear
          elementNum={1}
          transitionEffect={{ to: { opacity: 1 }, from: { opacity: 0 } }}
        >
          <Image
            style={{
              position: "absolute",
              bottom: 100,
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
            src={Axis}
            alt={"Axis"}
          />
        </Appear>
      </Slide>
      <Slide id="13">
        <Heading>Animations</Heading>
        <Text>Framer Motion</Text>
        <Text>React Spring</Text>
        <Text>D3 transitions (best as last resort imo)</Text>
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
      <Slide id="14">
        <Heading>Resources</Heading>
        <Text>
          D3 Slack Channel: <Link>https://d3-slackin.herokuapp.com/</Link>
        </Text>
        <Text>
          Observable: <Link>https://observablehq.com/@d3/gallery</Link>
        </Text>
        <Text>
          bl.ocks: <Link>https://blockbuilder.org/search</Link>
        </Text>
        <Text>
          Book:
          <Link>
            https://www.amazon.ca/Interactive-Data-Visualization-Web-Introduction/dp/1491921285/ref=dp_ob_title_bk
          </Link>
        </Text>
      </Slide>
      <Slide id="15">
        <Heading>Thank you ❤️ </Heading>
        <br />
        <br />
        <Text>@JulienAssouline on Twitter</Text>
        <Text>JulienAssouline on GitHub</Text>
        <br />
        <Link>https://github.com/JulienAssouline/rt-covid-remak</Link>
        <Link>https://github.com/JulienAssouline/d3-react-best-practices</Link>
      </Slide>
      <Progress></Progress>
    </Deck>
  );
}
export default App;
