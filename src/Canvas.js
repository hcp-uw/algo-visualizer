import React from 'react';
class Canvas extends React.Component{
    constructor(props){
        super(props);
        this.canvasRef = React.createRef();
        this.state = {
                width: props.width,
                height: props.height,
                arr: props.arr,
                index: 0 
        };
    }
    
    componentDidMount(){
        this.refresh();
    }

    componentDidUpdate(){
        this.refresh();
    }

    refresh = () => {
        let canvas = this.canvasRef.current;
        // let w = this.state.width, h = this.state.height;
        if(canvas === null){
            throw Error("Unable to draw, no canvas ref.");
        }
        let ctx = canvas.getContext("2d");
        if (ctx === null) {
            throw Error("Unable to draw, no valid graphics context.");
        }
        ctx.clearRect(0, 0, this.state.width, this.setState.height);
        // formula for caculating unifrom spacing width
        // w_s = (w_c - n * w_b)/n
        // console.log("blah " + this.state.arr);
        if(this.state.arr !== null){
            let arr = this.state.arr
            let n = arr.length; // number of vertical blocks to display
            let w_c = this.state.width;
            let w_b = 50, w_h = 250; // width and height for the vertical block
            let w_s = (w_c - n * w_b)/n;
            // console.log("w_c: " + w_c + " w_b: " + w_b + " w_s: "  + w_s);
            for(let i = 0; i < n; i++) {
                // console.log(w_s*i + w_b*i);
                this.drawVerticalBlock(ctx,w_s*(i + 1) + w_b*i, w_b, w_h, arr[i]);
            }
        }

    }

    // x, y are bottom right corner of the vertical rectangle
    drawVerticalBlock(ctx, x, width, height, num){
        // ctx.font = "20px Georgia";
        // ctx.fillText("120", x, this.state.height - verticalShift);
        let verticalShift = 50;
        ctx.fillStyle="blue";
        ctx.fillRect(x, this.state.height - height - verticalShift, width, height);

        // centering could be improved
        ctx.fillStyle="black";
        ctx.font = "20px Georgia";
        ctx.fillText(num, x + 20, this.state.height - verticalShift - 10);
    }

    render(){
        return (
            <canvas ref={this.canvasRef} width={this.state.width} height={this.state.height}/>
        );
    }
}

export default Canvas;