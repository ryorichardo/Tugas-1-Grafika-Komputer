let _id = 1;

export default class Polygon {
    constructor(id, x, y, z, coordinate, color) {
        if (id === undefined) {
            console.log("hah")
            this.id = _id++
            this.x = Math.random() * 1300
            this.y = Math.random() * 600
            this.r = Math.random() * 50
            this.coordinate = 
            [
                this.x + 2*this.r, this.y + this.r*Math.sqrt(3),
                this.x + 3*this.r, this.y,
                this.x + 1*this.r, this.y,
          
                this.x + 2*this.r, this.y + this.r*Math.sqrt(3),
                this.x + 3*this.r, this.y,
                this.x + 4*this.r, this.y + this.r*Math.sqrt(3),
          
                this.x + 2*this.r, this.y + this.r*Math.sqrt(3),
                this.x + 4*this.r, this.y + this.r*Math.sqrt(3),
                this.x + 3*this.r, this.y + 2*this.r*Math.sqrt(3), 
          
                this.x + 2*this.r, this.y + this.r*Math.sqrt(3),
                this.x + 3*this.r, this.y + 2*this.r*Math.sqrt(3), 
                this.x + 1*this.r, this.y + 2*this.r*Math.sqrt(3),
          
                this.x + 2*this.r, this.y + this.r*Math.sqrt(3),
                this.x + 1*this.r, this.y + 2*this.r*Math.sqrt(3),
                this.x + 0*this.r, this.y + this.r*Math.sqrt(3),
          
                this.x + 2*this.r, this.y + this.r*Math.sqrt(3),
                this.x + 0*this.r, this.y + this.r*Math.sqrt(3),
                this.x + 1*this.r, this.y,
            ];
          this.color = [Math.random(), Math.random(), Math.random(), 1];
        }
        else {
            this.id = id;
            this.x = x;
            this.y = y;
            this.z = z;
            this.coordinate = coordinate;
            this.color = color;
        }
        
    }
}