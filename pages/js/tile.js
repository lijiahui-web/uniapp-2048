function Tile(cell,value){
	this.x = cell.x
	this.y = cell.y
	this.value = value || 2
	this.previousPosition = null
	this.mergedFrom = null
}
Tile.prototype = {
	/* 
	 * 保存方块坐标信息
	 */
	savePosition: function(){
		this.previousPosition = {
			x: this.x,
			y: this.y
		}
	},
	/* 
	 * 更新方块坐标信息
	 */
	updatePosition: function(cell){
		this.x = cell.x
		this.y = cell.y
	}
}
module.exports = Tile