'use strict';
/**
 * Gra w kółko i krzyżyk na 5
 * @author Robert Urbański
 *
 */
var TicTacToe = {

	/**
	 * Wilekość planszy
	 */
	boardSize: 15,
	lang: 'pl',
	Translates: {
		pl: {
			sett: 'Ustawienia',
			newG: 'Nowa gra'
		}
	},
	rectStyle: {
		x: 0,
		y: 0,
		// Grubość linii
		strokeWidth: 1,
		// color linii
		stroke: 'lightgrey',
		// color wypełnienia
		fill: 'white',
		width: 30,
		height: 30
	},
	rectPrepare: function(x, y){

		var rect = this.rectStyle;
		rect.x = x;
		rect.y = y;
		return rect;
	},
	xStyle: {
		// Grubość linii
		strokeWidth: 3,
		// color linii
		stroke: 'red',
		lineCap: 'round',
		lineJoin: 'round'
	},
	settingsStyle: {
		Back: {
			globalAlpha: 0.8,
			// Grubość linii
			lineWidth: 1,
			// color linii
			strokeStyle: 'darkgray',
			// color wypełnienia
			fillStyle: 'lightgrey',
			roundnes: { upperLeft: 10, upperRight: 10, lowerLeft: 10, lowerRight: 10 }

		}
	},
	buttonStyle: {
		// Grubość linii
		lineWidth: 1,
		// color linii
		strokeStyle: 'lightgrey',
		// color wypełnienia
		fillStyle: null,
		Text: {
			textAlign: 'center',
			textBaseline: 'middle',
			font: '20pt Calibri',
			fillStyle: 'black'
		}
	},
	roundStyle: {
		// Grubość linii
		width: 3,
		// color linii
		stroke: 'blue'
	},
	/**
	 * Wielkość mapy odzwierciedla poziom gry z komputerem
	 * 0 - Łatwy (Easy)
	 * 1 - Średni (Medium)
	 * 2 - Ekspert (Expert)
	 */
	boardSizes: {
		0: 15,
		1: 20,
		2: 25
	},
	/**
	 * Obiekt Typu Kinetic.Group - kontener dla pól na planszy
	 * @Object
	 *
	 */
	Board: null,
	Settings: {
		/**
		 * Typ przeciwnika
		 * 1 - komputer
		 * 2 - drugi gracz
		 */
		opponentType: 1,
		/**
		 * Określa typ znaku gracza
		 * 0 - kółko
		 * 1 - krzyżyk
		 */
		xType: 0,
		/**
		 * Kto rozpoczyna. Wykorzystywany jest tylko przy Typie przeciwnika komputer
		 * 0 - ja
		 * 1 - komputer / gracz nr 2
		 */
		whoStarts: 0
	},
	Moves:{
		// Ilość ruchów wykonanych przez zawodnika
		i: 0,
		// Określa czy użytkownik może wykonać aktualnie ruch
		isItMyMove: 1
	},
	// Punkty na planszy które wygrały
	winnerPoints: null,

	// Obiekt zarządzający logiką komputera
	CPU: {
		/*
		 * @comment To tylko tak na razie dla symulacji
		 * Atak czy obrona
		 * 0 - obrona
		 * 1 - atak
		 */
		da: 0,
		points: null,
		/**
		 * Pierwszy punkt przeciwnika znaleziony w tablicy
		 * np. [5,6]
		 */
		opponentPoints: [],
		/**
		 * Punkty na planszy komputera
		 */
		CPUpoints: [],
		/**
		 * Punkty na planszy komputera 
		 */
		lastCPUAttackPoint: null,
		/**
		 * Wartość ustawiana w tablicy (planszy) dla gracza 1
		 */
		player1PointValue: 1,
		/**
		 * Wartość ustawiana w tablicy (planszy) dla gracza 2
		 * bez względu czy to jest CPU czy gracz fizyczny
		 */
		 player2PointValue: 2,
		/**
		 * Indeks określający rodzaj ataku z tablicy attacks
		 */
		attackFoundIndexOf: [],
		/**
		 * Możliwe punkty blokady ataków
		 */
		possibleBlockPoints: [],
		/**
		 * Określa indeks ostatniego wektora ataku w ramach CPU
		 */
		lastCPUattackIndexOf: -1,
		/**
		 * Stała - określa wartość dla ataku
		 */
		ATTACK: 1,
		/**
		 * Stała - określa wartość dla obrony
		 */
		DEFEND: 0,
		/**
		 * Ataki są ustawione priorytetami
		 * każdy obiekt zawiera
		 * att - ścieżkę ataku
		 * 		[0,-1] to wektor przejścia
		 */
		attacks: [
			 // 0
			 {
			 	/**
			 	 * x
			 	 * x
			 	 * x
			 	 * x
			 	 * x
			 	 */
				 att:[[0,-1],[0,-1],[0,3],[0,1],[0,1]],
				 min: 3,
				 minAmountBlockPoints: 2
			 },
			 // 1
			 {
			 	/**
			 	 * x
			 	 * x
			 	 * x
			 	 * x
			 	 * x
			 	 */
				 att:[[0,1],[0,1],[0,-3],[0,-1],[0,-1]],
				 min: 3,
				 minAmountBlockPoints: 2
			 },

			 // 2
			 {
			 	/**
			 	 * xxxxx
			 	 */
				 att:[[-1,0],[-1,0],[3,0],[1,0],[1,0]],
				 min: 3,
				 minAmountBlockPoints: 2
			 },
			 // 3
			 {
				 /**
				  * x
				  *  x
				  *   x
				  *    x
				  *     x
				  */
				 att:[[-1,-1],[-1,-1],[-1,-1],[4,4],[1,1],[1,1],[1,1]],
				 min: 3,
				 minAmountBlockPoints: 2
			 },
			 // 3
			 {
				 /**
				  * x
				  *  x
				  *   x
				  *    x
				  *     x
				  */
				 att:[[1,1],[1,1],[-3,-3],[-1,-1],[-1,-1]],
				 min: 3,
				 minAmountBlockPoints: 2
			 },
			 // 4
			 {
				 /**
				  *     x
				  *    x
				  *   x
				  *  x
				  * x
				  */

				 att:[[1,-1],[1,-1],[-3,3],[-1,1],[-1,1]],
				 min: 3,
				 minAmountBlockPoints: 2
			 },
			 // 5
			 {
				 /**
				  *     x
				  *    x
				  *   x
				  *  x
				  * x
				  */

				 att:[[-1,1],[-1,1],[3,-3],[1,-1],[1,-1]],
				 min: 3,
				 minAmountBlockPoints: 2
			 },
			 // 6
			 {
				 /**
				  * xx-
				  *   x
				  *   x
				  * 
				  */
				 att:[[-1,0],[2,1],[0,1],[0,1],[0,-4]],
				 min: 4,
				 minAmountBlockPoints: 1
			 },
			 // 7
			 {
				 /**
				  * -xx
				  * x
				  * x
				  */
				 att:[[1,0],[1,0],[-3,1],[0,1],[0,1]],
				 min: 4,
				 minAmountBlockPoints: 1
			 },
			 // 8
			 {
				 /**
				  * x
				  * x
				  * -xx
				  */
				 att:[[1,0],[1,0],[-3,-1],[0,-1],[0,-1]],
				 min: 4,
				 minAmountBlockPoints: 1
			 },
			 // 9
			 {
				 /**
				  *   x
				  *   x
				  * xx-
				  */
				 att:[[-1,0],[2,0],[1,-1],[0,-1],[0,-1]],
				 min: 4,
				 minAmountBlockPoints: 1
			 },
		],
		/**
		 * Ataki są ustawione priorytetami
		 * każdy obiekt zawiera
		 * att - ścieżkę ataku
		 * 		[0,-1] to wektor przejścia
		 */
		attacks2: {
			// Definiowane na podstawie wielkości tablicy
			'basicAttackMaxMoves': 0,
			'basic':[// 0
				 {
				 	/**
				 	 * x
				 	 * x
				 	 * x
				 	 * x
				 	 * x
				 	 */
					 att:[[0,-1],[0,1]],
					 min: 3,
					 minAmountBlockPoints: 2
				 },
				 // 2
				 {
				 	/**
				 	 * xxxxx
				 	 */
					 att:[[-1,0],[1,0]],
					 min: 3,
					 minAmountBlockPoints: 2
				 },
				 // 3
				 {
					 /**
					  * x
					  *  x
					  *   x
					  *    x
					  *     x
					  */
					 att:[[-1,-1],[1,1]],
					 min: 3,
					 minAmountBlockPoints: 2
				 },
				 // 4
				 {
					 /**
					  *     x
					  *    x
					  *   x
					  *  x
					  * x
					  */

					 att:[[1,-1],[-1,1]],
					 min: 3,
					 minAmountBlockPoints: 2
				 }
			],
			'advanced': [
				 // 6
				 {
					 /**
					  * xx-
					  *   x
					  *   x
					  * 
					  */
					 att:[[-1,0],[2,1],[0,1],[0,1],[0,-4]],
					 min: 4,
					 minAmountBlockPoints: 1
				 },
				 // 7
				 {
					 /**
					  * -xx
					  * x
					  * x
					  */
					 att:[[1,0],[1,0],[-3,1],[0,1],[0,1]],
					 min: 4,
					 minAmountBlockPoints: 1
				 },
				 // 8
				 {
					 /**
					  * x
					  * x
					  * -xx
					  */
					 att:[[1,0],[1,0],[-3,-1],[0,-1],[0,-1]],
					 min: 4,
					 minAmountBlockPoints: 1
				 },
				 // 9
				 {
					 /**
					  *   x
					  *   x
					  * xx-
					  */
					 att:[[-1,0],[2,0],[1,-1],[0,-1],[0,-1]],
					 min: 4,
					 minAmountBlockPoints: 1
				 }
			]
		},
		// Określa pozycję rodzaju wybranego ataku przez komputer
		CPUattackIndexOf: null,

		// Progres ataku czyli ostatnia pozycja jaka została wykonana
		CPUattackProgressIndexOf: null,

		// Określa punkt startowy ataku dla CPU
		CPUattackStartPoint: null,
		/**
		 * CPU attack Set Start Point
		 * Określa punkt startowy ataku z poziomu wielkości planszy
		 */
		CPUattackSetStartPoint: function(){
			//console.log('Function CPUattackSetStartPoint START ----------------' );

			var size = this.points.length-1;
			console.log('\t size='+(JSON.stringify(this.points)));
			var x1 = 0;
			var y1 = 0;
			// x1 sign. Znak operacji + / - czyli 1 / 0
			var x1s = 0;
			// y1 sign. Znak operacji + / - czyli 1 / 0
			var y1s = 0;

			if( size > 0 ){
				// Jeżeli brak punktów na mapie random
				if( this.opponentPoints.length === 0 ){
					x1 = Math.floor( ( Math.random()*size ) )+1;
					y1 = Math.floor( ( Math.random()*size ) )+1;
				}else{
					x1 = Math.floor( ( Math.random()*2 ) )+1;
					y1 = Math.floor( ( Math.random()*2 ) )+1;
					x1s = Math.floor( ( Math.random()*2 ) );
					y1s = Math.floor( ( Math.random()*2 ) );
				}
				//console.log('	x1='+x1+' y1='+y1+' x1s='+x1s+' y1s='+y1s );
				if( this.points[x1][y1] == null && ( x1 > 0 && y1 > 0 ) ){
					//this.points[x][y] = 2;
					if( this.opponentPoints.length === 0 ){
						this.CPUattackStartPoint = { 'x': x1, 'y':y1 };
					}else{
						this.CPUattackStartPoint = {'x':( x1s == 0 ? this.opponentPoints[0][0]-x1: this.opponentPoints[0][0]+x1 ), 'y':( y1s == 0 ? this.opponentPoints[0][1]-y1: this.opponentPoints[0][1]+y1 )} ;
						// Jeżeli punkty wychodzą poza obszar planszy wykonaj jeszcze raz
						// console.log( '		this.CPUattackStartPoint.x='+this.CPUattackStartPoint.x+' this.CPUattackStartPoint.y='+this.CPUattackStartPoint.y );
						if( this.CPUattackStartPoint.x > size || this.CPUattackStartPoint.y > size || this.CPUattackStartPoint.x < 0 || this.CPUattackStartPoint.y < 0 ){
							this.CPUattackStartPoint = null;
							this.lastCPUAttackPoint = null;
							this.CPUattackSetStartPoint();
						}
					}
				}else{
					this.CPUattackSetStartPoint();
				}
			}
		},
		/**
		 * @description Znajduje wszystkie zaznaczone punkt przeciwnika w tablicy
		 * // Aktualnie nie używane
		 */
		findOpponentPoints: function(){
			// Czyścimy za każdym razem tablicę punktów przeciwnika i znajdujemy je od nowa
			this.opponentPoints = [];

			var size = this.points.length;
			var k=0;
			var k2 = null;

			while( k < size ){

				if( (k2 = this.points[k].indexOf(1)) > -1 ){
					this.opponentPoints.push([ k, k2 ]);
				}

				k++;
			}
		},
		nextMove: function( points ){
			this.points = points;

			if( !this.analisys() == this.ATTACK ){
				this.attack();
			}else{
				this.defend();
			}

			return this.points;
		},
		analisys: function() {

		},
		/**
		 * @description Stara się obronić przed atakiem
		 */
		defend: function(){
			this.possibleBlockPoints = [];
			this.attackFoundIndexOf = [];

			console.log('Function defend START ----------------' );
			console.log('\t this.opponentPoints.lenght='+this.opponentPoints.length);
			console.log('\t this.points= '+JSON.stringify( this.points ) );

			// var attackDetails = this.findAttacks( this.opponentPoints, this.player1PointValue, this.player2PointValue );
			var attackDetails = this.findAttacks2( this.opponentPoints, this.player1PointValue, this.player2PointValue );

			this.possibleBlockPoints = attackDetails.possibleBlockPoints;
			// this.attackFoundIndexOf = attackDetails.attackFoundIndexOf;
			this.attackFoundIndexOf = attackDetails.allPossibleAttacks;

			if( this.possibleBlockPoints.length > 0 ){
				// this.attackFoundIndexOf.sort(TicTacToe.dynamicSortMultiple('-attackCount','ai'));
				console.log('\tthis.attackFoundIndexOf: '+JSON.stringify( this.attackFoundIndexOf ));
				console.log('\tpossibleBlockPoints: '+JSON.stringify( this.possibleBlockPoints ));
				this.points[this.attackFoundIndexOf[0].possibleBlockPoints[0].x][this.attackFoundIndexOf[0].possibleBlockPoints[0].y] = 2;
				this.CPUpoints.push( [this.attackFoundIndexOf[0].possibleBlockPoints[0].x, this.attackFoundIndexOf[0].possibleBlockPoints[0].y] );
				return true;
			}

			return false;
		},

		/**
		 * @description Znajduje ataki na podstawie podanych punktów
		 *
		 * @param {Array} points - Punkty gracza
		 * @param {int}	playerPointValue - wartość w tablicy dla poszukiwanych punktów w ramach ataku gracza
		 * @param {int} opponentPointValue - wartość w tablicy dla oponenta
		 * @returns {Object} attackTypes and posible block points
		 */
		findAttacks: function( points, playerPointValue, opponentPointValue ){
			console.log('Function findAttacks START ----------------' );

			var size = this.points.length-1;
			var attackFoundIndexOf = [];
			var allPossibleBlockPoints = [];
			var lastAttackPoint = [];
			// Dla każdego punktu przeciwnika sprawdź
			for( var opi=0; opi < points.length; opi++){
				console.log('\tPointIndex='+opi+' x:'+points[opi][0]+' y:'+points[opi][1] );

				// Sprawdź każdy typ ataku
				for( var attackIndex=0; attackIndex < this.attacks.length; attackIndex++ ){
					var moveIndex = 0, lastMoveIndex = 0;
					var x = points[opi][0];
					var y = points[opi][1];
					console.log('\t\tSprawdzam typ ataku nr:'+attackIndex);

					// Określa ilość znalezionych ruchów przeciwnika w ataku
					var attackCount = 1;
					var possibleBlockPoints = [];

					// Jeżeli znalazłeś rodzaj ataku pomiń go przy sprawdzaniu kolejnego pola
					if( attackFoundIndexOf.indexOf(attackIndex) === -1){
						for( moveIndex; moveIndex < this.attacks[attackIndex].att.length; moveIndex++ ){
							//console.log('Atak: '+JSON.stringify(this.attacks[attackIndex].att));
							// Określamy następny punkt do sprawdzenia
							x = x+this.attacks[attackIndex].att[moveIndex][0];
							y = y+this.attacks[attackIndex].att[moveIndex][1];

							console.log( '\t\t\tNastępny punkt do sprawdzenia to x:'+x+' y:'+y+'. attackCount= '+attackCount );
							if( x < 0 || y < 0 || x > size || y > size ){
								attackCount = 0;
								break;
							}else{

								console.log( '\t\t\t\tWartość to '+this.points[x][y]+' playerPointValue='+playerPointValue );

								if( this.points[x][y] === playerPointValue ){
									attackCount++;
									lastAttackPoint = [x, y];
									// Sprawdź czy następny jest pusty
									if( this.attacks[attackIndex].att[moveIndex+1] !== undefined ){
										var x2 = x+this.attacks[attackIndex].att[moveIndex+1][0];
										var y2 = y+this.attacks[attackIndex].att[moveIndex+1][1];
										console.log('\t\t\t\t\t this.points['+x2+']['+y2+']='+this.points[x2][y2]);
										if( this.points[x2][y2] == null ){
											// ustaw punkt możliwego blokowania
											possibleBlockPoints.push( { 'attIndex': attackIndex, 'x': x2, 'y': y2  } );
											//console.log('\t\t\t\t\tpossibleBlockPoints.length='+JSON.stringify(possibleBlockPoints));
										}else if ( this.points[x2][y2] == opponentPointValue ) {
											attackCount--;
										}
									}
								} else if ( this.points[x][y] == null ){
									if (moveIndex == 0) {
										possibleBlockPoints.push( { 'attIndex': attackIndex, 'x': x, 'y': y  } );
									}
									if( this.attacks[attackIndex].att[moveIndex+1] !== undefined ){
										var x2 = x+this.attacks[attackIndex].att[moveIndex+1][0];
										var y2 = y+this.attacks[attackIndex].att[moveIndex+1][1];
										if ( this.points[x2][y2] == opponentPointValue ) {
											console.log('\t\t\t\t\t this.points['+x2+']['+y2+']='+this.points[x2][y2]);
											attackCount--;
										}
									}
								} else if ( this.points[x][y] == opponentPointValue && moveIndex < this.attacks[attackIndex].att.length){
									attackCount--;
								}

							}
							if( attackCount == this.attacks[attackIndex].min ){
								lastMoveIndex = moveIndex+1;
							}
						}
					}
					if( attackCount >= this.attacks[attackIndex].min ){
						console.log( '\t\t Rozpoznano atak (rodzaj ataku)= '+attackIndex+' possibleBlockPoints.length='+JSON.stringify(possibleBlockPoints) );
						if( possibleBlockPoints.length > 0){
							attackFoundIndexOf.push( { 
								'ai': attackIndex, 
								'startPoint': points[opi], 
								'possibleBlockPoints': possibleBlockPoints, 
								'attackCount': attackCount, 
								'lastMoveIndex': lastMoveIndex,
								'lastAttackPoint': lastAttackPoint } );

							allPossibleBlockPoints.push(possibleBlockPoints);
						} else {
							console.log('\t\t Atak najwyraźniej został zablokowany');
						}
						break;
					} else {
						console.log( '\t\t Brak rozpoznanego ataku' );
					}

				}
			}
			return {
					'attackFoundIndexOf': attackFoundIndexOf,
					'possibleBlockPoints' : allPossibleBlockPoints
			 };
		},
		/**
		 * @description Znajduje ataki na podstawie podanych punktów
		 *
		 * @param {Array} points - Punkty gracza
		 * @param {int}	playerPointValue - wartość w tablicy dla poszukiwanych punktów w ramach ataku gracza
		 * @param {int} opponentPointValue - wartość w tablicy dla oponenta
		 * @returns {Object} attackTypes and posible block points
		 */
		findAttacks2: function( points, playerPointValue, opponentPointValue ){
			console.log('Function findAttacks START ----------------' );

			var size = this.points.length-1;
			var allPossibleAttacks = [];
			var allPossibleBlockPoints = [];
			var leftBorderAttackPoint = [];
			var rightBorderAttackPoint = [];

			// Dla każdego punktu przeciwnika sprawdź
			for( var opi=0; opi < points.length; opi++){
				console.log('\tPointIndex='+opi+' x:'+points[opi][0]+' y:'+points[opi][1] );

				// Sprawdź każdy typ ataku
				for( var attackIndex=0; attackIndex < this.attacks2.basic.length; attackIndex++ ){
					var moveIndex = 0;
					var x = points[opi][0];
					var y = points[opi][1];
					var x2 = null;
					var y2 = null;
					var previousPointValue = -1;
					console.log('\t\tSprawdzam typ ataku nr:'+attackIndex);

					// Określa ilość znalezionych ruchów przeciwnika w ataku
					var attackCount = 1;
					var possibleBlockPoints = [];

					// Jeżeli znalazłeś rodzaj ataku pomiń go przy sprawdzaniu kolejnego pola
					if( allPossibleAttacks.indexOf(attackIndex) === -1){

						while(moveIndex < this.attacks2.basicAttackMaxMoves){
							// Określamy następny punkt do sprawdzenia
							x = x+this.attacks2.basic[attackIndex].att[0][0];
							y = y+this.attacks2.basic[attackIndex].att[0][1];

							console.log( '\t\t\tNastępny punkt do sprawdzenia to x:'+x+' y:'+y+'. attackCount= '+attackCount );
							if( x < 0 || y < 0 || x > size || y > size ){
								break;
							} else {
								console.log( '\t\t\t\tWartość to '+this.points[x][y]+' playerPointValue='+playerPointValue );

								if( this.points[x][y] === opponentPointValue ){
									if(previousPointValue == playerPointValue || previousPointValue == -1){
										attackCount--;
									}
									break;
								} else if( this.points[x][y] === playerPointValue ){
									attackCount++;
									leftBorderAttackPoint = [x, y];
									// Określamy następny punkt do sprawdzenia
									x2 = x+this.attacks2.basic[attackIndex].att[0][0];
									y2 = y+this.attacks2.basic[attackIndex].att[0][1];

									if( this.points[x2][y2] == opponentPointValue ){
										attackCount--;
										break;
									}

								} else if( this.points[x][y] == null ) {
									possibleBlockPoints.push( { 'attIndex': attackIndex, 'x': x, 'y': y  } );
									// Określamy następny punkt do sprawdzenia
									x2 = x+this.attacks2.basic[attackIndex].att[0][0];
									y2 = y+this.attacks2.basic[attackIndex].att[0][1];

									if( this.points[x2][y2] == null ){
										break;
									}

								}
								moveIndex++;
								previousPointValue = this.points[x][y];
							}

						}

						// to teraz sprawdź w drugą stronę
						x = points[opi][0];
						y = points[opi][1];
						previousPointValue = -1;

						while(moveIndex < this.attacks2.basicAttackMaxMoves){
							// Określamy następny punkt do sprawdzenia
							x = x+this.attacks2.basic[attackIndex].att[1][0];
							y = y+this.attacks2.basic[attackIndex].att[1][1];
							console.log( '\t\t\tNastępny punkt do sprawdzenia to x:'+x+' y:'+y+'. attackCount= '+attackCount );
							if( x < 0 || y < 0 || x > size || y > size ){
								break;
							} else {
								console.log( '\t\t\t\tWartość to '+this.points[x][y]+' playerPointValue='+playerPointValue );

								if( this.points[x][y] === opponentPointValue ){
									if(previousPointValue == playerPointValue || previousPointValue == -1){
										attackCount--;
									}

									break;
								} else if( this.points[x][y] === playerPointValue ){
									attackCount++;
									rightBorderAttackPoint = [x, y];
									// Określamy następny punkt do sprawdzenia
									x2 = x+this.attacks2.basic[attackIndex].att[1][0];
									y2 = y+this.attacks2.basic[attackIndex].att[1][1];

									if( this.points[x2][y2] == opponentPointValue ){
										attackCount--;
										break;
									}
								} else if( this.points[x][y] == null ) {
									possibleBlockPoints.push( { 'attIndex': attackIndex, 'x': x, 'y': y  } );
									// Określamy następny punkt do sprawdzenia
									x2 = x+this.attacks2.basic[attackIndex].att[1][0];
									y2 = y+this.attacks2.basic[attackIndex].att[1][1];

									if( this.points[x2][y2] == null ){
										break;
									}
								}
								moveIndex++;
							}
						}
					}
					if( attackCount >= this.attacks2.basic[attackIndex].min ){
						console.log( '\t\t Rozpoznano atak (rodzaj ataku)= '+attackIndex+' possibleBlockPoints.length='+JSON.stringify(possibleBlockPoints) );
						if( possibleBlockPoints.length > 0){
							allPossibleAttacks.push( { 
								'ai': attackIndex, 
								'startPoint': points[opi], 
								'possibleBlockPoints': possibleBlockPoints, 
								'attackCount': attackCount, 
								'leftBorderAttackPoint': leftBorderAttackPoint,
								'rightBorderAttackPoint': rightBorderAttackPoint
								 } );

							allPossibleBlockPoints.push(possibleBlockPoints);
						} else {
							console.log('\t\t Atak najwyraźniej został zablokowany');
						}
						break;
					} else {
						console.log( '\t\t Brak rozpoznanego ataku' );
					}
				}
			}
			return {
					'allPossibleAttacks': allPossibleAttacks,
					'possibleBlockPoints' : allPossibleBlockPoints
			 };

		},
		/**
		 * W przypadku braku obrony atakuje
		 */
		attack: function(){

			console.log('Function attack START ----------------' );
			console.log('\t this.CPUattackIndexOf='+this.CPUattackIndexOf);

			if( this.CPUattackIndexOf == null ){
				// Narazie ustawiamy atak 1 z 10
				// TODO: Ustawić rodzaje ataków w zależności od poziomu zaawansowania
				this.setCPUattackIndexOf();
				console.log( '	Set this.CPUattackIndexOf='+this.CPUattackIndexOf+' '+JSON.stringify(this.attacks[this.CPUattackIndexOf]) );
			}

			// Jak nie ma punktu startowego ataku to go dodaj
			if( this.CPUattackStartPoint == null ){
				this.CPUattackSetStartPoint();
				this.points[this.CPUattackStartPoint.x][this.CPUattackStartPoint.y] = 2;
				this.CPUpoints.push( [this.CPUattackStartPoint.x, this.CPUattackStartPoint.y] );
				this.lastCPUAttackPoint = [this.CPUattackStartPoint.x, this.CPUattackStartPoint.y];
				return true;
			} else {
				// Znajdź ataki CPU aby dopasować najlepszy
				var cpuAttackDetails = this.findAttacks2( this.CPUpoints, this.player2PointValue, this.player1PointValue );
				cpuAttackDetails.attackFoundIndexOf = cpuAttackDetails.allPossibleAttacks;

				if( cpuAttackDetails.attackFoundIndexOf.length > 0 ){
					if( cpuAttackDetails.attackFoundIndexOf[0].ai != this.CPUattackIndexOf ){
						console.log('\t Changing CPUattackIndexOf from:'+this.CPUattackIndexOf+' to: '+cpuAttackDetails.attackFoundIndexOf[0].ai);
						this.CPUattackIndexOf = cpuAttackDetails.attackFoundIndexOf[0].ai;
						this.lastCPUattackIndexOf = cpuAttackDetails.attackFoundIndexOf[0].lastMoveIndex;
						this.lastCPUAttackPoint = cpuAttackDetails.attackFoundIndexOf[0].leftBorderAttackPoint;
					}
				}
				this.nextAttackFromAttackType();
			}

			return false;
		},

		nextAttackFromAttackType: function(){
			console.log('Function nextAttackFromAttackType START ----------------' );
			var lastPoint = this.lastCPUAttackPoint;
			this.lastCPUattackIndexOf++;

			// console.log('\t attacks='+(JSON.stringify( this.attacks ))+' this.CPUattackIndexOf= '+this.CPUattackIndexOf+' this.lastCPUattackIndexOf='+this.lastCPUattackIndexOf );
			var vector = this.attacks2.basic[this.CPUattackIndexOf].att[0];
			console.log('\t lastPoint['+lastPoint[0]+']['+lastPoint[1]+'] =  '+(JSON.stringify( lastPoint ))+' vector='+(JSON.stringify( vector )) );
			var x = lastPoint[0]+vector[0];
			var y = lastPoint[1]+vector[1];
			console.log('\t this.points['+x+']['+y+'] =  '+(JSON.stringify( this.points[x] )) );
			if( this.points[x][y] === undefined ){
				console.log('\t Ustawiam punkt ataku '+x+':'+y);
				this.points[x][y] = 2;
				this.CPUpoints.push( [x, y] );
			} else {
				console.log('\t Atak nie udany '+x+':'+y+' trzeba znaleźć coś innego');
				this.setCPUattackIndexOf();
				this.attack();
			}

		},

		setCPUattackIndexOf: function(){
			var newCPUattackIndexOf = Math.floor( ( Math.random()*this.attacks2.basic.length ) );
			if( newCPUattackIndexOf != this.CPUattackIndexOf ){
				this.CPUattackIndexOf = newCPUattackIndexOf;
			}

			this.lastCPUattackIndexOf = -1;
		}

	},

	/**
	 * Obiekt canvas
	 */
	canvas: null,

	/**
	 * Tutaj są zaznaczane konkretne pozycje na planszy
	 * Będzie to 2 wymiarora tablica. Wartości to
	 * 0 - brak zaznaczonego pola
	 * 1 - zaznaczone pole przez 1 gracza
	 * 2 - zaznaczone pole przez 2 gracza
	 */
	points: null,

	/**
	 * Obiekt context
	 */
	context: null,
	init : function( canvas ){
		// Tworzymy scenę
		this.Stage = new Kinetic.Stage({
	        container: 'canvasContainer',
	        width: 450,
	        height: 500
		});
		// Tworzymy warstwę
		this.Layer = new Kinetic.Layer();
		console.log( 'Stage:'+JSON.stringify(this.Stage));
		//this.canvas = this.Stage.getCanvas();
		//this.context = this.canvas.getContext();

		// Tworzymy gradient dla przycisku
//		var grd = this.context.createLinearGradient(0, 450, 0, 500);
//		grd.addColorStop(0, "white");
//		grd.addColorStop(0.1, "white");
//		grd.addColorStop(1, "lightgray");
//		this.buttonStyle.fillStyle = grd;

		// Zasilamy tablicę
		this.newGame();

		// Rysujemy tablicę
		this.drawBoard();
	},

	/**
	 * Narysuj planszę
	 */
	drawBoard: function(){

		console.log('Function drawBoard START ----------------' );
		// Punkt wyjściowy do rysowania
		var _parent = this;

		var i = 0;
		var point = { x:0, y:0 };

		this.Board = new Kinetic.Group(
			{ draggable: true }
		);
		this.Board.on("dragstart", function(){
			// Aby nie było propagacji zdarzeń z każdego okienka przy przesuwaniu ustawiam znacznik który nie będzie wykonywał zadania w akcji dla podobiektów.
			this.dragstart = 1;
		});
		this.Board.on("dragend", function(){
			// Zdejmuję znacznik
			this.dragstart = 0;
		});

		//_parent.drawSettings();

		// Rysuj wiersze
		for( i;i < _parent.boardSize; i++ ){
			var j = 0;

			// Rysuj kolumny
			for( j; j < _parent.boardSize; j++ ){

				var rect = new Kinetic.Rect( this.rectPrepare(point.x, point.y) );
				rect.j = j;
				rect.i = i;
				rect.points = {x:point.x, y:point.y};
//		    	console.log(' rect.x='+rect.points.x+' rect.y='+rect.points.y);

				// Dodaj zdarzenia tylko jak nie ma zwycięzcy
				if( this.winnerPoints === null ){
					// Dodajemy jak tylko kliknie pole na planszy
                    rect.on("mouseup touchend", function(){

                    	if( _parent.Board.dragstart === undefined || _parent.Board.dragstart === 0 ){
	                    	// Sprawdzamy czy to jest ruch użytkownika jeżeli nie to nie zaznaczamy kolejnego pola
	                    	console.log( ''+_parent.Moves.isItMyMove );
	                    	if( _parent.Moves.isItMyMove ){
	                    		if( _parent.points[this.j][this.i] != TicTacToe.CPU.player2PointValue ){
		                    		_parent.points[this.j][this.i] = TicTacToe.CPU.player1PointValue;
		                    		if( _parent.Settings.opponentType === 1 ){
		                    			_parent.CPU.opponentPoints.push( [this.j,this.i] );
		                    		}

		                    		console.log('	this.i='+this.i+' this.j='+j);
		                    		console.log('	this.points.x='+this.points.x+' this.points.y='+this.points.y);
		                    		if( _parent.winnerPoints == null){
			                    		_parent.Settings.xType == 0 ? _parent.drawO( this.points ) : _parent.drawX( this.points );

			                    		// Sprawdź czy wygrałem
			                    		_parent.winnerPoints = _parent.checkWinner( 1, _parent.CPU.opponentPoints );

			                    		// O ile nie wygrałem
			                    		if( _parent.winnerPoints == null ){
			                    			// Wykonuje kolejny ruch w przypadku gry z komputerem. Ustawia kolejny ruch w przypadku gry w 2 osoby.
			                    			_parent.nextMove();
			                    		}
			                    	}
			                    }
	                    	}
                    	}
                    });
				}

				this.Board.add( rect );
				// I ustawiamy kolejny punkt
				point.x = point.x+this.rectStyle.width;
			}
			// I następna linia
			point.x = 0;
			point.y = point.y+this.rectStyle.height;
		}

		this.Layer.add(this.Board)
		this.Stage.add(this.Layer);
		// Teraz rysujemy 2 przyciski

//		_parent.drawButton(point, 225, 50, _parent.Translates[_parent.lang].newG, this);
//		point.x =+ 225;
//		_parent.drawButton(point, 225, 50, _parent.Translates[_parent.lang].sett, this);

	},

	/**
	 * Funkcja ma na celu:
	 *  - Zaznaczenie kolejnego ruchu.
	 *  - Uniemożliwienie graczowi wykonania ruchu w oczekiwaniu na kolejny ruch przeciwnika
	 */
	nextMove: function(){
		this.Moves.isItMyMove = 0;
		console.log('Function TickTackTo.nextMove START ----------------' );
		if( this.Settings.opponentType == 1 ){
			this.points = this.CPU.nextMove( this.points );
			// console.log("	All points="+JSON.stringify(this.points ) );
			var point = this.CPU.CPUpoints[this.CPU.CPUpoints.length-1];
			console.log('\tCPU last point='+JSON.stringify(point));
			this.Moves.isItMyMove = 1;
			point = { x:point[0], y:point[1] };

			this.Settings.xType === 0 ? this.drawX( point ) : this.drawO( point );

		}

	},
	xPrepare: function( xpoint ){
		var rectStyle = this.rectStyle;

		var rect = this.Board.children[xpoint.y*this.boardSize+xpoint.x];
		// console.log(JSON.stringify(rect));
		var Xo = this.xStyle;
		Xo.x = rect.attrs.x;
		Xo.y = rect.attrs.y;
		Xo.drawFunc = function(context){
			// context przesuwa punkt początku rysowania na pozycję obiektu klikniętego

			context.beginPath();
			context.moveTo( 6, 6 );
			context.lineTo( rectStyle.width-6, rectStyle.height-6 );

			context.moveTo( rectStyle.width-6, 6 );
			context.lineTo( 6, rectStyle.height-6 );
			context.closePath();
			context.strokeShape(this);
		};
		return Xo;
	},

	/**
	 * Rysuj krzyżyk
	 */
	drawX: function( apoint ){

//		console.log('Drawing x.');
//		console.log('	apoint.x='+apoint.x+' apoint.y='+apoint.y + ' drawFunc' );
		var xsh = new Kinetic.Shape( this.xPrepare( apoint ) );

		this.Board.add( xsh );
		this.Layer.draw();
	},

	/**
	 * Rysuj kółko
	 */
	drawO: function( apoint ){
		var style = this.roundStyle;
		style.x = apoint.x+this.rectStyle.width/2;
		style.y = apoint.y+this.rectStyle.height/2;
		style.radius = 9;

		var xsh = new Kinetic.Circle( style );

		this.Board.add( xsh );
		this.Layer.draw();

	},
	/**
	 * Rysuje ustawienia
	 */
	drawSettings: function(){
		var sdCt = this.context;
		// zapisywanie stanu kontekstu
		//sdCt.save();

		this.events.beginRegion();

		var dsC = this.canvas;
		var point = { x: 10, y:10 };
		var rWidth = dsC.width-2*point.x;
		var rHeight = dsC.height-2*point.x;
		this.setStyle( sdCt, this.settingsStyle.Back );

		sdCt.beginPath();
		sdCt.roundRect( point.x, point.y, rWidth, rHeight, this.settingsStyle.Back.roundnes );
		sdCt.closePath();
		sdCt.full();
		sdCt.fillStyle = 'black';

		sdCt.fillText( this.Translates[this.lang].sett, point.x+(rWidth/2), point.y+20 );

		this.events.addRegionEventListener('mouseup', function(){
			console.log('drawSettings clicked ');
		});
        this.events.closeRegion();

        // odtwarzanie stanu kontekstu
        //sdCt.restore();
	},

	Array2D: function( many ){
		var myarray=new Array( many );
		for ( var i=0; i < many; i++)
			myarray[i]=new Array( many );
		return myarray;
	},
    dynamicSort: function(property) {
		var sortOrder = 1;
		if(property[0] === "-") {
			sortOrder = -1;
			property = property.substr(1);
		}

		return function (a,b) {
			var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
			return result * sortOrder;
	    };
	},
	dynamicSortMultiple: function() {
		/*
		 * save the arguments object as it will be overwritten
		 * note that arguments object is an array-like object
		 * consisting of the names of the properties to sort by
		 */
		var props = arguments;
		return function (obj1, obj2) {
			var i = 0, result = 0, numberOfProperties = props.length;
			/* try getting a different result from 0 (equal)
			 * as long as we have extra properties to compare
			 */
			while(result === 0 && i < numberOfProperties) {
				result = TicTacToe.dynamicSort(props[i])(obj1, obj2);
				i++;
			}
			return result;
		}
	},

	/**
	 * Rysuje przycisk
	 */
	drawButton: function( point, width, height, text, callBack ){
		this.events.beginRegion();

		var dbCt = this.context;
		dbCt.beginPath();
		this.setStyle(this.context, this.buttonStyle);

		dbCt.rect( point.x, point.y, width, height );
		dbCt.full();
		dbCt.closePath();
		this.setStyle( this.context, this.buttonStyle.Text );
		//console.log( 'Text point.x='+point.x + Math.floor(width/2)+' y='+Math.floor(height/2));
		dbCt.fillText(text, (point.x + Math.floor(width/2)), point.y+Math.floor(height/2) );

        this.events.addRegionEventListener("mouseup", function(){
        	console.log('	Przycisk '+text+' zista kliknięty');
        });

        this.events.closeRegion();
	},

	/**
	 * Sprawdź czy jest zwycięzca
	 * @param oppType - typ przeciwnika
	 */
	checkWinner: function( oppType, points ){
		console.log('Function checkWinner START ----------------' );

		var l = 0;
		// typy ataków prostych do 5
		var attacks = [[1,0],[0,1],[1,1],[-1,1]];

		// licznik punktów
		var pCount = 1;

		// punkty wygrane
		var winPoints = [];

		// dla każdego punktu
		for( l; l < points.length; l++ ){
			var a2 = 0;

			// Dla każdego typu ataku
			for( a2; a2 < attacks.length; a2++ ){
				var l1 = 0;
				var x2 = points[l][0];
				var y2 = points[l][1];
				winPoints = [];
				pCount = 1;
				console.log('	Następny atak a2='+a2);
				// sprawdź 5 kolejnych punktów z ataku

				for( l1; l1 < 4; l1++ ){
					x2 = x2+attacks[a2][0];
					y2 = y2+attacks[a2][1];
					console.log('\t\t x2='+x2+' '+this.points[x2] );
					//console.log('	this.points '+(this.points[x2][y2]));
					if( this.points[x2] != undefined && this.points[x2][y2] != undefined && this.points[x2][y2] == oppType ){
						pCount++;
						winPoints.push( [x2, y2] );
					}
				}

				if( pCount == 5 ){
					console.log(' WYGRANA !!!! '+JSON.stringify( winPoints ));
					return winPoints;
				}
			}
		}
		return null;
	},

	/**
	 * Ustawia styl z obiektu w podanym kontekście
	 */
	setStyle: function( ctx, styleObj ){
		for( var prop in styleObj ){
			ctx[prop] = styleObj[prop];
			//console.log( "typ na stylu"+(typeof styleObj[prop]) );
		}
	},
	/**
	 * Czyści wszysktie parametry w tablicy aby można było zacząć od nowa
	 */
	newGame: function(){
		console.log('Canvas w:'+this.Stage.attrs.width+" h:"+this.Stage.attrs.height);
		this.points = this.Array2D(this.boardSize);
		this.winnerPoints = null;
		this.CPU.opponentPoints = [];
		this.CPU.attackFoundIndexOf = [];
		this.CPU.possibleBlockPoints = [];
		this.CPU.CPUpoints = [];
		this.CPU.CPUattackIndexOf = null;
		this.CPU.CPUattackProgressIndexOf = null;
		this.CPU.attacks2.basicAttackMaxMoves = this.boardSize;
	}
}

// Implementacja klonowania obiektów
/*function Copy(){};
Object.prototype.copy = function(){
	Copy.prototype = this;
	return new Copy();
}
*/