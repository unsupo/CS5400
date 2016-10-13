/**
 * Created by jarndt on 10/7/16.
 */
/*
Create a maze object of a certain width and height
 */
function Maze(width, height) {
    var self = this;
    self.cells = [];
    initializeCells();

    //pick a random x and y starting point to construct maze
    var startX = Math.floor(Math.random()*width);
    var startY = Math.floor(Math.random()*height);

    //start the recursion
    visit(self.cells[startX][startY]);

    function initializeCells() {
        for(var x = 0; x<width; x++) {
            self.cells[x] = [];
            for (var y = 0; y < height; y++)
                self.cells[x][y] = new Cell(x,y);
        }
    }

    //Create a cell at x,y location
    function Cell(x,y) {
        this.x = x;
        this.y = y;

        //which walls are up on this cell
        this.walls = {
            left : true,
            right : true,
            up : true,
            down : true
        };

        //have we visited this cell yet
        this.visited = false;
    }

    //initially just a cell and no direction
    function visit(cell,direction) {
        //this cell has now been visited
        cell.visited = true;

        //if a direction is given, knock down the wall
        if(direction)
            cell.walls[direction]=false;

        //get all possible movements from this position
        var moves = getMoves(cell);

        while(moves.length > 0){
            var index = Math.floor(Math.random() * moves.length);
            var nextCell = moves[index];

            var direction = "up";
            if(cell.y > nextCell.y){
                cell.walls.up = false;
                direction = "down";
            }else if(cell.x < nextCell.x){
                cell.walls.right = false;
                direction = "left";
            }else if(cell.y < nextCell.y){
                cell.walls.down = false;
                direction = "up";
            }else if(cell.x > nextCell.x){
                cell.walls.left = false;
                direction = "right";
            }
            visit(nextCell,direction);

            moves = getMoves(cell);
        }

    }

    //walls only useful when solving the maze
    function getMoves(cell, walls) {
        var options = [];

        function checkOptions(x, y) {
            if(walls)
                if((y < cell.y && cell.walls.up) ||
                    (x > cell.x && cell.walls.right) ||
                    (y > cell.y && cell.walls.down) ||
                    (x < cell.x && cell.walls.left))
                    return;

            if(self.cells[x] && self.cells[x][y] && !self.cells[x][y].visited)
                options.push(self.cells[x][y])
        }

        checkOptions(cell.x, cell.y - 1); //check to the down
        checkOptions(cell.x, cell.y +1); //check to the up
        checkOptions(cell.x - 1, cell.y); //check to the left
        checkOptions(cell.x + 1, cell.y); //check to the right

        return options;
    }



    self.objects = [];

    self.drawMaze = function() {
        var m = new Maze(10,10);

        for(var i = 0; i<m.cells.length; i++)
            for(var j = 0; j<m.cells[i].length; j++)
                self.drawCell(m.cells[i][j]);

        return self.objects;
    }

    self.drawCell = function(cell) {
        if(!cell)
            return;

        var x = cell.x*4.5;
        var y = cell.y*4.5;
        if(cell.walls.down) {
            var c = new Cube(2, 1, .25);
            c.translate(0+x, 0, 0+y);
            c.texture = textures.wall;
            c.buildObject();
            self.objects.push(c);
        }
        if(cell.walls.right) {
            var c1 = new Cube(2.5, 1, .25);
            c1.rotate(90, 0, 1, 0);
            c1.translate(-2.25+x, 0, -2.25-y);
            c1.buildObject();
            c1.texture = textures.wall;
            self.objects.push(c1);
        }
        if(cell.walls.left) {
            var c2 = new Cube(2.5, 1, .25);
            c2.rotate(90, 0, 1, 0);
            c2.translate(-2.25+x, 0, 2.25-y);
            c2.buildObject();
            c2.texture = textures.wall;
            self.objects.push(c2);
        }
        if(cell.walls.up) {
            var c3 = new Cube(2, 1, .25);
            c3.translate(0+x, 0, -4.5+y);
            c3.buildObject();
            c3.texture = textures.wall;
            self.objects.push(c3);
        }

        var floor = new Cube(2.5,.25,2.5);
        floor.translate(x,-1.25,-2.25+y);
        floor.buildObject();
        floor.texture = textures.floor;
        self.objects.push(floor);

        // var ceiling = new Cube(2.5,.25,2.5);
        // ceiling.translate(x,0,y);
        // ceiling.buildObject();
        // ceiling.texture = textures.ceiling;
        // self.objects.push(ceiling);
    }
}