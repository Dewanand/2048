var game = {					
	//status: 'new',
	start: function(size) {

		this.status = 'new';
		board.size = size || 4;
		board.draw();
		tile.generate();

	}
}

var board = {
	size: 4,
	draw: function () {
		var self = this;
		var html_text = '';
		//var index = 1;
		var board_array = []

		board_array = _.range( Math.pow(this.size, 2));

		var row_array = _.range( 0, Math.pow(this.size, 2), self.size);

		html_text = _.reduce(board_array, function(memo, item, index) {
			var tr = '';
			var html_text = '';
			if(index === 1) {
				memo = '<table><tr><td bgcolor="#CDC1B4" id="cell_'+ (index -1) +'" ></td>';
			} 
			if(_.contains(row_array, item)) {
				tr = '</tr><tr>';
			} 

			html_text = memo + tr +  '<td bgcolor="#CDC1B4" id="cell_'+ index +'" ></td>';

			if (index == Math.pow(self.size, 2) -1) {
				html_text =  html_text + '</tr></table>';
			}

			return html_text;
		});

		document.getElementById('board').innerHTML = html_text;

		document.onkeydown = function() {
		    tile.move(window.event.keyCode);
		}
		document.addEventListener('touchstart', tile.handleTouchStart, false);        
		document.addEventListener('touchmove', tile.handleTouchMove, false);
	},		
	update: function (board_array) {

		//var blank_spot = _.where(board_array, {value: ""});

	
		_.each(board_array, function (cell, index) {
			document.getElementById('cell_' + index).innerHTML = cell.value;
			tile.tile_array[index].isMerge = false;
			tile.tile_array[index].isBlocked = false;

		});
		tile.setColor(board_array);

	}
	
}

var tile = {
	xDown:null,
	yDown:null,
	tile_array: [],
	tile_color_array: [
		'#eee4da'
		,'#ede0c8'
		,'#f2b179'
		,'#f59563'
		,'#f67c5f'
		,'#f65e3b'
		,'#edcf72'
		,'#edcc61'
		,'#edc850'
		,'#edc53f'
		,'#edc22e'
	],


	generate: function () {
		var count = Math.pow(board.size, 2);
		
		var num_array = _.range(0, count);	
	
		this.tile_array = _.map(
								num_array, function(num) {							
								position = num;							
								value = document.getElementById('cell_' + (num)).innerHTML;
								row = parseInt((num )/board.size) +1;
								col = (num + 1)%board.size || board.size;
								isMerge = false;
								isBlank = value ? false : true;
								isBlocked = false;
								value = (value)? parseInt(value): value;
								return {position, value, isMerge, isBlank, row, col, isBlocked};
							});

		var blank_spot = _.where(this.tile_array, {value: ""});

		if (blank_spot.length) {
			var new_tile_pos = Math.floor((Math.random() * (blank_spot.length) ));
			var cell = document.getElementById('cell_' + blank_spot[new_tile_pos].position);
			var newNum;
			if (Math.floor((Math.random() * 10)) === 4) {
				newNum = 4;
			} else {
				newNum = 2;
			}

			cell.innerHTML = newNum; 			

			//console.log(blank_spot[new_tile_pos].position);						
			this.tile_array[blank_spot[new_tile_pos].position].value = newNum;
			this.tile_array[blank_spot[new_tile_pos].position].isBlank = false;
			cell.style.backgroundColor = this.tile_color_array[Math.log2(newNum) - 1];
			cell.style.color = '#776e65';
		} else {
			console.log('Game Over');
			return;
		}			
	},
	setColor: function (board_array) {
		self = this;
		_.each(board_array, function(cell, index) {
			document.getElementById('cell_' + index).style.backgroundColor = (cell.value) ? self.tile_color_array[Math.log2(cell.value) - 1]: '#CDC1B4';
			document.getElementById('cell_' + index).style.color = (cell.value < 5)? '#776e65' : '#F9F4EE';

		});

	},
	move: function (keyCode) {
		var generateDelay = 0;

		switch(keyCode) {  
			case 37: //left
				var hasMoved;
				hasMoved = this.moveHor();					
				
				board.update(this.tile_array);
				if (hasMoved) {					
					setTimeout(function(){
					    tile.generate();
					}, generateDelay);
				} 
				break;
			case 38: //up
				var hasMoved;
				hasMoved = this.moveVert();					
				board.update(this.tile_array);
				if (hasMoved) {					
					setTimeout(function(){
					    tile.generate();
					}, generateDelay);
				} 
				break;
			case 39: //right
				var hasMoved;
				this.tile_array = this.flipHor(this.tile_array);
				hasMoved = this.moveHor();				
				this.tile_array = this.flipHor(this.tile_array);
				board.update(this.tile_array);
				if (hasMoved) {					
					setTimeout(function(){
					    tile.generate();
					}, generateDelay);
				} 
				break;
			case 40: //'down'
				var hasMoved;

				this.tile_array = this.flipVert(this.tile_array);
				hasMoved = this.moveVert();				
				this.tile_array = this.flipVert(this.tile_array);
				board.update(this.tile_array);
				if (hasMoved) {					
					setTimeout(function(){
					    tile.generate();
					}, generateDelay);
				} 
				break;
		}

	},
	
	handleTouchStart: function (evt) {
		const firstTouch = evt.touches[0] || evt.originalEvent.touches[0];                                     
		this.xDown = firstTouch.clientX;                                      
		this.yDown = firstTouch.clientY;                                      
	},
	handleTouchStart: function (evt) {
			if ( ! this.xDown || ! this.yDown ) {
			return;
		}

		var xUp = evt.touches[0].clientX;                                    
		var yUp = evt.touches[0].clientY;

		var xDiff = xDown - xUp;
		var yDiff = yDown - yUp;

		if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
			if ( xDiff > 0 ) {
				move(39); //right
			} else {
				move(37);/* left swipe */
			}                       
		} else {
			if ( yDiff > 0 ) {
				move(38);
			} else { 
				move(40);
			}                                                                 
		}
		/* reset values */
		this.xDown = null;
		this.yDown = null;
			
	},	
	moveHor: function () {
		console.log(this.tile_array);
		var hasMoved;
	 	_.each(this.tile_array, function(tile, index, org_tile_array) {
				
			var process_array = _.filter(org_tile_array, function (row_tile, index) {
				return (row_tile.row == tile.row && row_tile.col > tile.col);
			});
			//console.log(process_array);
			
			 _.each(process_array, function(process_tile, index) {
			 	//console.log( tile.value   + '  '  + process_tile.value)
			 	if (!tile.isBlocked) {	
					if (process_tile.value === tile.value && process_tile.value !== '' && !tile.isMerge) {
						
						tile.value = (tile.value) ? Math.pow(2,Math.log2(process_tile.value) + 1):  process_tile;
						org_tile_array[process_tile.position].value = '';
						org_tile_array[process_tile.position].isBlank = true;
						process_tile.value = '';
						tile.isMerge = true;
						hasMoved = true;


					} else if (process_tile.value !== '' && tile.value === '') {
						tile.value = process_tile.value;
						org_tile_array[process_tile.position].value = '';
						process_tile.value = '';
						hasMoved = true;

					} else if (tile.value !== process_tile.value && tile.value && process_tile.value) {
						tile.isBlocked = true;
					}
				}
			});			
		});	
		return(hasMoved);
	},
	moveVert: function () {
		console.log(this.tile_array);
		var hasMoved;
	 	_.each(this.tile_array, function(tile, index, org_tile_array) {
				
			var process_array = _.filter(org_tile_array, function (row_tile, index) {
				return (row_tile.col == tile.col && row_tile.row > tile.row);
			});
			//console.log(process_array);
			
			 _.each(process_array, function(process_tile, index) {
			 	//console.log( tile.value   + '  '  + process_tile.value)
			 	if (!tile.isBlocked) {	
					if (process_tile.value === tile.value && process_tile.value !== '' && !tile.isMerge) {						
						tile.value = (tile.value) ? Math.pow(2,Math.log2(process_tile.value) + 1):  process_tile;
						org_tile_array[process_tile.position].value = '';
						org_tile_array[process_tile.position].isBlank = true;
						process_tile.value = '';
						tile.isMerge = true;
						hasMoved = true;
					} else if (process_tile.value !== '' && tile.value === '') {
						tile.value = process_tile.value;
						org_tile_array[process_tile.position].value = '';
						process_tile.value = '';
						hasMoved = true;
					} else if (tile.value !== process_tile.value && tile.value && process_tile.value) {
						tile.isBlocked = true;
					}
				}
			});			
		});	
		return(hasMoved);
	},
	flipHor: function (toFlipArray) {
		var size = board.size;
		var flipHorArray = [];
 		var rowArray = _.range(size); 
		_.each(rowArray,function(element, index) {
			var slicedArray = _.where(toFlipArray, {row: index + 1}).reverse(); 	
			_.each(slicedArray, function (slicedElement, innerIndex, orgArray) {
				slicedElement.col = (size - slicedElement.col) + 1;
				slicedElement.position = innerIndex + size*index;				
			});
			flipHorArray.push(slicedArray);
		});
		return _.flatten(flipHorArray);
	},
	flipVert: function (toFlipArray) { 
		///console.log(toFlipArray)
		var size = board.size;
		var flipVertArray = [];
 		var colArray = _.range(size); 
		_.each(colArray,function(element, index) {
			var slicedArray = _.where(toFlipArray, {col: index + 1}).reverse();  
			
			_.each(slicedArray, function (slicedElement, innerIndex, orgArray) {
				slicedElement.row = (size -	slicedElement.row) + 1;
				slicedElement.position = index +  size * innerIndex
			});
			flipVertArray.push(slicedArray);
		});
		return _.sortBy(_.flatten(flipVertArray), 'position');
	}
}
	
game.start(4);




