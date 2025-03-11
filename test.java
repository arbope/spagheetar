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

    static int[] none;
	static String mode, key;
	public static void main (String[]Args){
		Scanner sc = new Scanner(System.in);
		
		//PREGUNTA No DE TRASTES
		System.out.println("Hola :), cuántos trastes tiene tu instrumento??");
		int frets = sc.nextInt();

		//PREGUNTA No DE CUERDAS
		System.out.println("Hola :), cuántas cuerdas tiene tu instrumento??");
		int strings = sc.nextInt();
        String[]stringNotation = new String[strings];
		sc.nextLine();

        //ASKS TUNING
        System.out.println("tell me your tuning, example: 'EADbGBE'");
        String tuning = sc.nextLine();
        
        for (int i = 0; i < tuning.length(); i++) {
            boolean placed = false;
            if (i < tuning.length() - 1){
                if (tuning.charAt(i + 1) == 98 || tuning.charAt(i + 1) == 35){
                    for (int j = 0; j< stringNotation.length && !placed; j++){
                        if (stringNotation[tuning.length() - j - 2] == null){
                            stringNotation[tuning.length() - j - 2] = tuning.substring(i, i + 2);
                            placed = true;
                        }
                    } 
                } 
            }
            if (tuning.charAt(i) > 64 && tuning.charAt(i) < 72){
                    for (int k = 0; k< stringNotation.length && !placed; k++){
                        if (stringNotation[tuning.length() - k - 2] == null){
                            stringNotation[tuning.length() - k - 2] = tuning.substring(i, i + 1);
                            placed = true;
                        }   
                    }
            }
        }

        // for (int i= 0; i < stringNotation.length; i++){
        //     System.out.println(stringNotation[strings - i - 1]);
        // }        
    	//ASKS MODE 
		System.out.println("Select mode! \n MAJOR / MINOR \n MINOR_ARM / MINOR_MEL");
		mode = sc.nextLine();
		switch (mode.toUpperCase()){
			case "MAJOR":
				none = MAJOR;
				break;
			case "MINOR":
				none = MINOR;
				break;
			case "MINOR_MEL":
				none = MINOR_MEL;
				break;
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
				keyShift = 1;
				break;
		
			case "C#":
			case "DB":  
				keyShift  = 2;
				break;

			case "D":   
				keyShift = 3;
				break;
			
			case "D#":
				keyShift = 4;
				break;

			case "E": 
			case "FB":
				keyShift = 5;
				break;
		
			case "F":  
			case "E#": 
				keyShift = 6;
				break;
		
			case "F#":
			case "GB":
				keyShift = 7;
				break;
		
			case "G":
				keyShift = 8;
				break;

			case "G#":
			case "AB":
				keyShift = 9;
				break;
		
			case "A":
				keyShift = 10;
				break;
				
			case "A#":
			case "BB": 
				keyShift = 11;
				break;
		
			case "B":
			case "CB":
				keyShift = 12;      
				break;
	
			default:
				keyShift = 0;            
				break;
		}
		keyShift--;

		//PRINTS NUMBERS
		System.out.println();
        System.out.print("_");
		for (int i = 0; i < frets + 1; i++){
			if (i < 10)
				System.out.print(i + "_|");
			else 	
				System.out.print(i + "|");
		}

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
					stringShift = 1;
					break;
			
				case "C#":
				case "Db":  
					stringShift  = 2;
					break;
	
				case "D":   
					stringShift = 3;
					break;
				
				case "D#":
					stringShift = 4;
					break;
	
				case "E": 
				case "Fb":
					stringShift = 5;
					break;
			
				case "F":  
				case "E#": 
					stringShift = 6;
					break;
			
				case "F#":
				case "Gb":
					stringShift = 7;
					break;
			
				case "G":
					stringShift = 8;
					break;
	
				case "G#":
				case "Ab":
					stringShift = 9;
					break;
			
				case "A":
					stringShift = 10;
					break;
					
				case "A#":
				case "Bb": 
					stringShift = 11;
					break;
			
				case "B":
				case "Cb":
					stringShift = 12;      
					break;
		
				default:
					stringShift = 0;            
					break;
				}
			stringShift--;
			
			//PRINTS EACH FRET
			for (int i = 1; i < frets + 1; i++){
				int n = (i + stringShift - keyShift) % 12;
				boolean printed = false;
				for (int j = 0; j < none.length; j++){
					if (n == none[j] && !printed){
						if (notes[(n + keyShift) % 12].length() == 2)						
							System.out.print(notes[(n + keyShift) % 12] + "|");
						else 						
							System.out.print(notes[(n + keyShift) % 12] + " |");
						printed = true;
					} 
				}
				if (!printed){
					System.out.print("__|");
				}
			}
		}
		
	/////////////////////////////////////
	// PARA HACER 
	/////////////////////////////////////
	// Elegir, bemoles o sostenidos
	// Num trastes, 12, normales, todos...
	// Acciones con números
	// Acciones en bucle
	/////////////////////////////////////
	
	}
}