function Grid(size){
	this.size = size
	this.cells = this.empty()
}
Grid.prototype = {
	/* 
	 * 全部置空
	 */
	empty: function(){
		let cells = []
		for(let i = 0;i < this.size;i++){
			let row = cells[i] = []
			for(let j = 0;j < this.size;j++){
				row.push(null)
			}
		}
		return cells
	},
	/* 
	 * 返回空位置坐标集合
	 */
	availableCells: function(){
		let cells = []
		for(let i = 0;i < this.size;i++){
			for(let j = 0;j < this.size;j++){
				if(!this.cells[i][j]){
					cells.push({
						x:i,
						y:j
					})
				}
			}
		}
		return cells
	},
	/* 
	 * 是否存在空位置
	 */
	cellsAvailable: function(){
		return !!this.availableCells().length
	},
	/* 
	 * 返回一个随机空位置坐标
	 */
	randomAvailableCell: function(){
		let cells = this.availableCells()
		if(cells.length){
			return cells[Math.floor(Math.random()*cells.length)]
		}
	},
	/* 
	 * 插入方块
	 */
	insertTile: function(tile){
		this.cells[tile.x][tile.y] = tile
	},
	/* 
	 * 返回相应位置的方块信息
	 * cell: 位置信息坐标
	 */
	cellContent: function(cell){
		if(this.withinBounds(cell)){
			return this.cells[cell.x][cell.y] || null
		}else{
			return null
		}
	},
	/* 
	 * 判断位置信息是否合法
	 */
	withinBounds: function(cell){
		return cell.x >= 0 && cell.x < this.size && cell.y >= 0 && cell.y < this.size
	},
	/* 
	 * 判断是否是空
	 */
	emptyCell: function(cell){
		return !this.cellContent(cell)
	},
	/* 
	 * 删除相应坐标位置的方块
	 */
	removeTile: function(cell){
		this.cells[cell.x][cell.y] = null
	}
}
module.exports = Grid