let Grid = require('./grid.js')
let Tile = require('./tile.js')
function GameManager(size){
	this.size = size
	this.initBlockNum = 2		//初始块个数
}
GameManager.prototype = {
	/* 
	 * 初始表格
	 * 返回：两级数组
	 */
	setup: function(){
		this.grid = new Grid(this.size)
		this.score = 0
		this.over = false
		this.won = false
		this.addStartTile()
		return this.grid.cells
	},
	/* 
	 * 添加初始随机块
	 */
	addStartTile: function(){
		for(let i = 0;i < this.initBlockNum; i++){
			this.addRandomTiles()
		}
	},
	/* 
	 * 随机在空位置插入一个方块
	 */
	addRandomTiles: function(){
		if(this.grid.cellsAvailable()){
			let cell = this.grid.randomAvailableCell()
			let value = Math.random() < 0.9 ? 2 : 4
			let tile = new Tile(cell,value)
			this.grid.insertTile(tile)
		}
	},
	restart: function(){
		return this.setup()
	},
	/* 
	 * 滑动处理
	 * direction: 移动方向		1向右,3向左,2向下,4向上
	 */
	move: function(direction){
		let _this = this
		let vector = this.getVector(direction)
		let traversals = this.buildTraversals(vector)
		let cell,tile
		let moved = false
		_this.prepareTiles()
		traversals.x.forEach(function(x){
			traversals.y.forEach(function(y){
				cell = {
					x: x,
					y: y
				}
				tile = _this.grid.cellContent(cell)
				if(tile){
					let positions = _this.findFarthestTail(cell, vector)
					let next = _this.grid.cellContent(positions.next)
					if(next && next.value == tile.value && !next.mergedFrom){
						//合并
						let merged = new Tile(positions.next, tile.value*2)
						merged.mergedFrom = [tile, next]
						_this.grid.insertTile(merged)
						_this.grid.removeTile(tile)
						tile.updatePosition(positions.next)
						_this.score += merged.value
						if(merged.value == 2048){
							_this.won = true
						}
					}else{
						_this.moveTile(tile, positions.farthest)
					}
					if(!_this.positionsEqual(cell, tile)){
						moved = true
					}
				}
			})
		})
		if(moved){
			this.addRandomTiles()
			if(!this.movesAvailable()){
				this.over = true
			}
			return this.actuate()
		}
	},
	/* 
	 * 移动方向位置参数
	 * direction: 移动方向		1向右,3向左,2向下,4向上
	 */
	getVector: function(direction){
		let map = {
			1: {
				x: 0,
				y: 1
			},
			2: {
				x: 1,
				y: 0
			},
			3: {
				x: 0,
				y: -1
			},
			4: {
				x: -1,
				y: 0
			}
		}
		return map[direction]
	},
	/* 
	 * 移动方向处理，确定搜索位置优先级
	 * 例如：向下滑动，优先从下向上搜索滑块
	 */
	buildTraversals: function(vector){
		let traversals = {
			x: [],
			y: []
		}
		for(let x = 0;x < this.size; x++){
			traversals.x.push(x)
			traversals.y.push(x)
		}
		if(vector.x == 1){
			//向下
			traversals.x = traversals.x.reverse()
		}
		if(vector.y == 1){
			//向右
			traversals.y = traversals.y.reverse()
		}
		return traversals
	},
	/* 
	 * 滑动之前保存滑块位置信息
	 */
	prepareTiles: function(){
		let tile
		for(let x = 0; x < this.size; x++){
			for(let y = 0; y < this.size; y++){
				tile = this.grid.cells[x][y]
				if(tile){
					tile.mergedFrom = null
					tile.savePosition()
				}
			}
		}
	},
	// 找到当前偏移方向存在最远的空单元格
  // 如：向右偏移，那么返回当前行最靠右的空单元格及其右侧距离其最远的一个格子，向下一样
	findFarthestTail: function(cell, vector){
		let previous
		do {
			previous = cell
			cell = {
				x: previous.x + vector.x,
				y: previous.y + vector.y
			}
		}
		while (this.grid.withinBounds(cell) && this.grid.emptyCell(cell)){
			return {
				farthest: previous,
				next: cell
			}
		}
	},
	/* 
	 * 处理保存滑块值cells数据
	 * tile:滑动后的滑块信息，cell:滑动后滑块的位置信息
	 */
	moveTile: function(tile, cell){
		this.grid.cells[tile.x][tile.y] = null
		this.grid.cells[cell.x][cell.y] = tile
		tile.updatePosition(cell)
	},
	/* 
	 * 判断时候进行了位置变化
	 * start: 开始位置, end: 结束位置
	 */
	positionsEqual: function(start, end){
		return start.x == end.x && start.y == end.y
	},
	/* 
	 * 判断是否可以继续滑动
	 */
	movesAvailable: function(){
		return this.grid.cellsAvailable() || this.tileMatchesAvailable()
	},
	/* 
	 * 判断滑块四面是否存在相邻的相同数据
	 */
	tileMatchesAvailable: function(){
		let _this = this
		let tile
		for(let x = 0; x < this.size; x++){
			for(let y = 0; y < this.size; y++){
				tile = this.grid.cellContent({x: x,y: y})
				if(tile){
					for (let direction = 1; direction <= 4; direction++) {
							let vector = _this.getVector(direction);
							let cell = { x: x + vector.x, y: y + vector.y };
							let other = _this.grid.cellContent(cell);
							if (other && other.value === tile.value) {
									return true;
							}
					}
				}
			}
		}
	},
	/* 
	 * 返回当前全部信息
	 */
	actuate: function(){
		return {
			grids: this.grid.cells,
			over: this.over,
			score: this.score,
			won: this.won
		}
	}
}
module.exports = GameManager