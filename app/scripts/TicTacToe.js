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
			sett: "Ustawienia",
			newG: "Nowa gra"
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
	xPrepare: function( xpoint ){
		var pointa = xpoint;
		var rectStyle = this.rectStyle;
		
		var Xo = this.xStyle;
		Xo.x = xpoint.x;
		Xo.y = xpoint.y;
		Xo.drawFunc = function(context){
			// context przesuwa punkt początku rysowania na pozycję obiektu klikniętego
			context.beginPath();
			context.moveTo( 6, 6 );
			//console.log('moving to x:'+(pointa.x+6)+' y:'+(pointa.y+6));
			context.lineTo( rectStyle.width-6, rectStyle.height-6 );
			context.stroke();
					
			context.moveTo( rectStyle.width-6, 6 );
			context.lineTo( 6, rectStyle.height-6 );
			context.closePath();
			context.strokeShape(this);
		}
		return Xo;
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
			textAlign: "center",
			textBaseline: "middle",
			font: "20pt Calibri",
			fillStyle: "black"
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
		 * 2 - drugi uzytkownik
		 */
		opponentType: 1,
		/**
		 * Określa typ znaku użytkownika
		 * 0 - kółko 
		 * 1 - krzyżyk
		 */
		xType: 0,
		/**
		 * Kto rozpoczyna. Wykorzystywany jest tylko przy Typie przeciwnika komputer 
		 * 0 - ja
		 * 1 - komputer
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
		 * Indeks określający rodzaj ataku z tablicy attacks
		 */
		attackFoundIndexOf: [],
		/**
		 * Możliwe punkty blokady ataków
		 */
		possibleBlockPoints: [],
		/**
		 * Ataki są ustawione priorytetami
		 * każdy obiekt zawiera 
		 * att - ścieżkę ataku
		 * 		[0,-1] to wektor przejścia
		 */
		attacks: [
			 {
				 att:[[0,-1],[0,-1],[0,-1],[0,4],[0,1],[0,1],[0,1]],
				 min: 3 
			 },
			 {
				 att:[[-1,0],[-1,0],[-1,0],[4,0],[1,0],[1,0],[1,0]],
				 min: 3
			 },
			 {
				 /**
				  * x
				  *  x
				  *   x
				  *    x
				  *     x
				  */
				 att:[[-1,-1],[-1,-1],[-1,-1],[4,4],[1,1],[1,1],[1,1]],
				 min: 3
			 },
			 {
				 /**
				  * x
				  *  x
				  *   x
				  *    x
				  *     x
				  */				 
				 att:[[1,1],[1,1],[1,1],[-4,-4],[-1,-1],[-1,-1],[-1,-1]],
				 min: 3
			 },
			 {
				 /**
				  *     x
				  *    x
				  *   x
				  *  x
				  * x
				  */

				 att:[[1,-1],[1,-1],[1,-1],[-4,4],[-1,1],[-1,1],[-1,1]],
				 min: 3
			 },
			 {
				 /**
				  *     x
				  *    x
				  *   x
				  *  x
				  * x
				  */

				 att:[[-1,1],[-1,1],[-1,1],[4,-4],[1,-1],[1,-1],[1,-1]],
				 min: 3
			 },
			 {
				 /**
				  * xx-
				  *   x
				  *   x
				  */
				 att:[[-1,0],[2,0],[1,1],[0,1],[0,1]],
				 min: 4
			 },
			 {
				 /**
				  * -xx
				  * x
				  * x
				  */
				 att:[[1,0],[1,0],[-3,1],[0,1],[0,1]],
				 min: 4
			 },
			 {
				 /**
				  * x
				  * x
				  * -xx
				  */
				 att:[[1,0],[1,0],[-3,-1],[0,-1],[0,-1]],
				 min: 4
			 },
			 {
				 /**
				  *   x
				  *   x
				  * xx-
				  */
				 att:[[-1,0],[2,0],[1,-1],[0,-1],[0,-1]],
				 min: 4
			 },
		],
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
		CPUattackSSP: function(){
			console.log('Function CPUattackSSP START ----------------' );

			var size = this.points.length-1;
			var x1 = 0;
			var y1 = 0;
			// x1 sign. Znak operacji + / - czyli 1 / 0
			var x1s = 0;
			// y1 sign. Znak operacji + / - czyli 1 / 0
			var y1s = 0;
			
			if( size > 0 ){
				// Jeżeli brak punktów na mapie random
				if( this.opponentPoints.length == 0 ){
					x1 = Math.floor( ( Math.random()*size ) )+1;
					y1 = Math.floor( ( Math.random()*size ) )+1;
				}else{
					x1 = Math.floor( ( Math.random()*2 ) )+1;
					y1 = Math.floor( ( Math.random()*2 ) )+1;
					x1s = Math.floor( ( Math.random()*2 ) );
					y1s = Math.floor( ( Math.random()*2 ) );
				}
				//console.log('	x1='+x1+' y1='+y1+' x1s='+x1s+' y1s='+y1s );
				if( this.points[x1][y1] == null && ( x1 > 0 && y1 > 0 ) )
					//this.points[x][y] = 2;
					if( this.opponentPoints.length == 0 ){
						this.CPUattackStartPoint = { 'x': x1, 'y':y1 };
					}else{						
						this.CPUattackStartPoint = {'x':( x1s == 0 ? this.opponentPoints[0][0]-x1: this.opponentPoints[0][0]+x1 ), 'y':( y1s == 0 ? this.opponentPoints[0][1]-y1: this.opponentPoints[0][1]+y1 )} ;
						// Jeżeli punkty wychodzą poza obszar planszy wykonaj jeszcze raz
						//console.log( '		this.CPUattackStartPoint.x='+this.CPUattackStartPoint.x+' this.CPUattackStartPoint.y='+this.CPUattackStartPoint.y );
						if( this.CPUattackStartPoint.x > size || this.CPUattackStartPoint.y > size || this.CPUattackStartPoint.x < 0 || this.CPUattackStartPoint.y < 0 ){
							this.CPUattackStartPoint = null;
							this.CPUattackSSP();
						}
					}
				else
					this.CPUattackSSP();
			}
		},
		/**
		 * Znajduje wszystkie zaznaczone punkt przeciwnika w tablicy
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

			//if( this.opponentPoints.length == 0 ){
				//this.findOpponentPoints();
				//console.log( 'opponentPoints:'+this.opponentPoints );
			//}
			
			if( !this.defend() )
				this.attack();
			
			return this.points;
		},
		/**
		 * Stara się obronić przed atakiem 
		 */
		defend: function(){
			var opi = 0;
			var size = this.points.length-1;
			this.possibleBlockPoints = [];
			this.attackFoundIndexOf = [];
			
			console.log('Function defend START ----------------' );
			console.log('this.opponentPoints.lenght='+this.opponentPoints.length);
			
			// Dla każdego punktu przeciwnika sprawdź
			for( opi; opi < this.opponentPoints.length; opi++){
				console.log( '	opponentPointIndex='+opi+' x:'+this.opponentPoints[opi][0]+' y:'+this.opponentPoints[opi][1] );
				var u = 0;

				// Sprawdź każdy typ ataku 
				for( u; u < this.attacks.length; u++ ){
					var v = 0;
					var x = this.opponentPoints[opi][0];
					var y = this.opponentPoints[opi][1];
					console.log('		Sprawdzam typ ataku nr:'+u+'');
					
					// Określa ilość znalezionych ruchów przeciwnika w ataku 
					var attackCount = 1;
					var possibleBlockPoints = [];

					// Jeżeli znalazłeś rodzaj ataku pomiń go przy sprawdzaniu kolejnego pola 
					if( this.attackFoundIndexOf.indexOf(u) == -1){
						for( v; v < this.attacks[u].att.length; v++ ){
							//console.log('Atak: '+JSON.stringify(this.attacks[u].att));
							// Określamy następny punkt do sprawdzenia
							var x = x+this.attacks[u].att[v][0];
							var y = y+this.attacks[u].att[v][1];
							if( x < 0 || y < 0 || x > size || y > size ){
								break;
							}else{
								//console.log( '			Następny punkt do sprawdzenia to x:'+x+' y:'+y+'.' );
								//console.log( '			Wartość to '+this.points[x][y] );
								
								if( this.points[x][y] == 1 ){
									attackCount++;
								}else if( this.points[x][y] == null ){
									// ustaw punkt możliwego blokowania 
									possibleBlockPoints.push( { "attIndex": u, "x": x, "y": y  } );
								}else{
									attackCount=0;
									break;
								}
							}
						}
						if( attackCount >= this.attacks[u].min ){
							console.log( '		Rozpoznano atak (rodzaj ataku)= '+u+' possibleBlockPoints.length='+JSON.stringify(possibleBlockPoints) );
							this.attackFoundIndexOf.push(u);
							this.possibleBlockPoints.push(possibleBlockPoints);
						} else {
							//console.log( '		Brak rozpoznanego ataku' );
						}
					}
				}
			}
			
			if( this.possibleBlockPoints.length > 0 ){
				console.log('	possibleBlockPoints: '+this.possibleBlockPoints[this.possibleBlockPoints.length-1][0].x);
				this.points[this.possibleBlockPoints[this.possibleBlockPoints.length-1][0].x][this.possibleBlockPoints[this.possibleBlockPoints.length-1][0].y] = 2;
				this.CPUpoints.push( [x, y] );
				return true;
			}

			return false;
		},

		/**
		 * W przypadku braku obrony atakuje 
		 */		
		attack: function(){

			console.log('Function attack START ----------------' );
			console.log('this.CPUattackIndexOf='+this.CPUattackIndexOf);
			
			if( this.CPUattackIndexOf == null ){
				// Narazie ustawiamy atak 1 z 10
				// TODO: Ustawić rodzaje ataków w zależności od poziomu zaawansowania
				this.CPUattackIndexOf = Math.floor( ( Math.random()*this.attacks.length ) );
				console.log( '	Ustawiono this.CPUattackIndexOf='+this.CPUattackIndexOf+' '+JSON.stringify(this.attacks[this.CPUattackIndexOf]) );
			}

			// Jak nie ma punktu startowego ataku to go dodaj
			if( this.CPUattackStartPoint == null ){
				this.CPUattackSSP();
				this.points[this.CPUattackStartPoint.x][this.CPUattackStartPoint.y] = 2;

				return true;
			}
			
			return false;
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
	        container: 'container',
	        width: 450,
	        height: 500
		});
		// Tworzymy warstwę
		this.Layer = new Kinetic.Layer();
		console.log( 'Stage:'+JSON.stringify(this.Stage));
//		this.canvas = this.Stage.getCanvas();
		//this.context = this.Stage.getContext();

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
				if( this.winnerPoints == null ){
					// Dodajemy jak tylko kliknie pole na planszy
                    rect.on("mouseup touchend", function(){
                    	
                    	if( _parent.Board.dragstart == undefined || _parent.Board.dragstart == 0 ){
	                    	// Sprawdzamy czy to jest ruch użytkownika jeżeli nie to nie zaznaczamy kolejnego pola
	                    	if( _parent.Moves.isItMyMove ){
	                    		_parent.points[this.j][this.i] = 1;
	                    		if( _parent.Settings.opponentType == 1 ){
	                    			_parent.CPU.opponentPoints.push( [this.j,this.i] );
	                    		}
	                    	
	                    		console.log('	this.i='+this.i+' this.j='+j);
	                    		console.log('	this.points.x='+this.points.x+' this.points.y='+this.points.y);
	
	                    		_parent.Settings.xType == 0 ? _parent.drawO( this.points ) : _parent.drawX( this.points );

	                    		// Sprawdź czy wygrałem
	                    		_parent.winnerPoints = _parent.checkWinner( 1, _parent.CPU.opponentPoints );
	                    	
	                    		// O ile nie wygrałem
	                    		if( _parent.winnerPoints == null )
	                    			// Wykonuje kolejny ruch w przypadku gry z komputerem. Ustawia kolejny ruch w przypadku gry w 2 osoby. 
	                    			_parent.nextMove();
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
			console.log("	CPU last point="+JSON.stringify(this.points ) );
			var point = this.CPU.CPUpoints[this.CPU.CPUpoints.length-1];
			
			this.Moves.isItMyMove = 1;
			var point = { x:point[0], y:point[1] };
			
			this.Settings.xType == 0 ? this.drawX( point ) : this.drawO( point );
			
		}
			
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
					console.log('		x2='+x2+' y2='+y2 );
					if( typeof this.points[x2] != undefined && typeof this.points[x2][y2] != undefined && this.points[x2][y2] == oppType ){
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
	}
}

// Implementacja klonowania obiektów  
/*function Copy(){};
Object.prototype.copy = function(){	
	Copy.prototype = this;
	return new Copy();
}
*/