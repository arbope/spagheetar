	/////////////////////////////////////
	// PARA HACER 
	/////////////////////////////////////
	// Elegir, bemoles o sostenidos
	// Num trastes, 12, normales, todos...
	// Acciones con números
	// Acciones en bucle
	/////////////////////////////////////
	import java.util.ArrayList;
	import java.util.Scanner;

	public class test{
		static String[]notes  = {"C","C#","D","D#","E","F","F#","G","G#","A","A#","B"};
		static String[]notes2 = {"C","Db","D","bE","E","F","Gb","G","Ab","A","Bb","B"};
																		   
		static int stringShift, keyShift;                                   
		static int[] MAJOR     = {0,2,4,5,7,9,11};                           
		static int[] MINOR_MEL = {0,2,3,5,7,9,11};                            
		static int[] MINOR_HAR = {0,2,3,5,7,8,11};                             
		static int[] MINOR	   = {0,2,3,5,7,8,10};                              
		static final String[] COLORS = new String[] {                            
		"\u001B[31m",       		    //  0: Tónica - Rojo                      \\
		"\u001B[93m", 				   //  1: b2 (segunda menor) - Naranja oscuro  \\
		"\u001B[33m;",	    		  //  2: 2ª Mayor - Naranja                     \\
		"\u001B[38;5;208m",          //  3: 3ª menor - Amarillo                      \\
		"\u001B[38;5;202m",         //  4: 3ª Mayor - Amarillo claro                  \\
		"\u001B[32m",              //  5: 4ª Justa - Verde                             \\
		"\u001B[92m",             //  6: Tritono (#4 / b5) - Verde claro (tensión)      \\
		"\u001B[34m",            //  7: 5ª Justa - Azul                                  \\
		"\u001B[35m",           //  8: 6ª menor - Violeta                                 \\
		"\u001B[95m",          //  9: 6ª Mayor - Violeta claro                             \\
		"\u001B[38;5;139m",   //  10: 7ª menor - Magenta tenue                              \\
		"\u001B[30;1m"       //  11: 7ª Mayor - Negro brillante                              \\
		};	
		static final String RESET = "\u001B[0m";
		static final String[] NOMBRES = new String[] {
			"Tónica (1)",
			"Segunda menor (b2)",
			"Segunda mayor (2)",
			"Tercera menor (b3)",
			"Tercera mayor (3)",
			"Cuarta justa (4)",
			"Tritono (#4/b5)",
			"Quinta justa (5)",
			"Sexta menor (b6)",
			"Sexta mayor (6)",
			"Séptima menor (b7)",
			"Séptima mayor (7)"
		};

		static String logo = """
				░█▀▀░█▀█░█▀█░█▀▀░█░█░█▀▀░█▀▀░▀█▀░█▀█░█▀▄░
				░▀▀█░█▀▀░█▀█░█░█░█▀█░█▀▀░█▀▀░░█░░█▀█░█▀▄░
				░▀▀▀░▀░░░▀░▀░▀▀▀░▀░▀░▀▀▀░▀▀▀░░▀░░▀░▀░▀░▀░
				""";
		static int[] none;
		static String[]stringNotation;
		static String mode, key, tuning;
		static int strings, frets;
		public static void main (String[]Args){
			Scanner sc = new Scanner(System.in);
			
			for (int i = 0; i < 12; i++) {
				System.out.println(COLORS[i] + String.format("%2d: %s", i, NOMBRES[i]) + RESET);
			}
						
			askInstrumentSpecs(sc);
			
			parseTuning(tuning);
		
			askModeAndKey(sc);	

			printFretNumbers();

			printFretNotes();

			sc.close();
		}

		static void parseTuning(String tuning){
			for (int i = 0; i < tuning.length(); i++) {
				boolean placed = false;
				if (i < tuning.length() - 1){
					if (tuning.charAt(i + 1) == 98 || tuning.charAt(i + 1) == 35){
						for (int j = 0; j< stringNotation.length && !placed; j++){
							if (stringNotation[strings - j - 1] == null){
								stringNotation[strings - j - 1] = tuning.substring(i, i + 2);
								placed = true;
							}
						} 
					} 
				}
				if (tuning.charAt(i) > 64 && tuning.charAt(i) < 72){
						for (int k = 0; k< stringNotation.length && !placed; k++){
							if (stringNotation[strings - k - 1] == null){
								stringNotation[strings - k - 1] = tuning.substring(i, i + 1);
								placed = true;
							}   
						}
				}
			}

			// for (int i= 0; i < stringNotation.length; i++){
			//     System.out.println(stringNotation[strings - i - 1]);
			// }	
		}

		static void printFretNumbers(){
			//PRINTS NUMBERS
			System.out.println();
			System.out.print("_");
			for (int i = 0; i < frets + 1; i++){
				if (i < 10)
				System.out.print(i + "_|");
				else 	
				System.out.print(i + "|");
			}
		}

		static void printFretNotes(){
			//PRINTS EACH STRING
			for (int k = 0; k < strings; k++){
				System.out.println();
				if (stringNotation[k].length() == 2){
					System.out.print(stringNotation[k] + "}|" );
				} else {
					System.out.print(stringNotation[k] + " }|" );
				}
				switch (stringNotation[k].toUpperCase()){
					case "C": 
					case "B#":
						stringShift = 0;
						break;
				
					case "C#":
					case "DB":  
						stringShift  = 1;
						break;

					case "D":   
						stringShift = 2;
						break;
					
					case "D#":
					case "EB":
						stringShift = 3;
						break;

					case "E": 
					case "FB":
						stringShift = 4;
						break;
				
					case "F":  
					case "E#": 
						stringShift = 5;
						break;
				
					case "F#":
					case "GB":
						stringShift = 6;
						break;
				
					case "G":
						stringShift = 7;
						break;

					case "G#":
					case "AB":
						stringShift = 8;
						break;
				
					case "A":
						stringShift = 9;
						break;
						
					case "A#":
					case "BB": 
						stringShift = 10;
						break;
				
					case "B":
					case "CB":
						stringShift = 11;      
						break;
			
					default:
						stringShift = 0;            
						break;
					}
				
				//System.out.println("SS :" + stringShift + " ks: " + keyShift);
				//PRINTS EACH FRET
				for (int i = 1; i < frets + 1; i++){
					int n = (i + stringShift - keyShift) % 12;
					if ( n < 0 ) { n = 12 + n; }
					boolean printed = false;
					for (int j = 0; j < none.length; j++){
						if (n == none[j] && !printed){
							if (notes[(n + keyShift) % 12].length() == 2)						
								System.out.print(COLORS[n % 12] + notes[(n + keyShift) % 12] + RESET + "|");
							else 						
								System.out.print(COLORS[n % 12] + notes[(n + keyShift) % 12] + RESET +  " |");
							printed = true;
						} 
					}
					if (!printed){
						System.out.print("__|");
					}
				}
			}

		}

		static void askInstrumentSpecs(Scanner sc){
			//PREGUNTA No DE TRASTES
			System.out.println();
			System.out.println(logo);
			System.out.println("Hola :), cuántos trastes tiene tu instrumento??");
			frets = sc.nextInt();	

			//PREGUNTA No DE CUERDAS
			System.out.println("Hola :), cuántas cuerdas tiene tu instrumento??");
			strings = sc.nextInt();
			stringNotation = new String[strings];
			sc.nextLine();

			//ASKS TUNING
			System.out.println("tell me your tuning, example: 'EADbGBE or C#F#BEG#C#'");
			tuning = sc.nextLine();
			
		}

		static void askModeAndKey(Scanner sc){
			//ASKS MODE 
			System.out.println("Select mode! \n MAJOR / MINOR \n MINOR_ARM / MINOR_MEL");
			mode = sc.nextLine();
			switch (mode.toUpperCase()){
				case "MA":
				case "MAJ":
				case "MAJOR":
					none = MAJOR;
					break;
				case "MI":
				case "MINOR":
					none = MINOR;
					break;
				case "MM":
				case "MIN_MEL":
				case "MINOR_MEL":
					none = MINOR_MEL;
					break;
				case "MH":
				case "MIN_HAR":
				case "MINOR_HAR":
					none = MINOR_HAR;
					break;
			}	

			//ASKS ROOT 
			System.out.println("Select key:");
			key = sc.nextLine();
			switch (key.toUpperCase()){
				case "C": 
				case "B#":
					keyShift = 0;
					break;
			
				case "C#":
				case "DB":  
					keyShift  = 1;
					break;

				case "D":   
					keyShift = 2;
					break;
				
				case "D#":
					keyShift = 3;
					break;

				case "E": 
				case "FB":
					keyShift = 4;
					break;
			
				case "F":  
				case "E#": 
					keyShift = 5;
					break;
			
				case "F#":
				case "GB":
					keyShift = 6;
					break;
			
				case "G":
					keyShift = 7;
					break;

				case "G#":
				case "AB":
					keyShift = 8;
					break;
			
				case "A":
					keyShift = 9;
					break;
					
				case "A#":
				case "BB": 
					keyShift = 10;
					break;
			
				case "B":
				case "CB":
					keyShift = 11;      
					break;
		
				default:
					keyShift = 0;            
					break;
			}
		}
	}