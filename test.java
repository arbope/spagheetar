import java.util.ArrayList;
import java.util.Scanner;

public class test{
	static String[]notas  = {"C","C#","D","D#","E","F","F#","G","G#","A","A#","B"};
    static String[]notas2 = {"C","Db","D","bE","E","F","Gb","G","Ab","A","Bb","B"};

	static int stringShift, keyShift;
	static int[] MAYOR     = {0,2,4,5,7,9,11};
    static int[] MENOR_MEL = {0,2,3,5,7,9,11};
    static int[] MENOR_ARM = {0,2,3,5,7,8,11};
	static int[] MENOR	   = {0,2,3,5,7,8,10};


    static int[] none;
	static String mode, key;
	public static void main (String[]Args){
		Scanner sc = new Scanner(System.in);
		
		//PREGUNTA No DE TRASTES
		System.out.println("hola, frets?");
		int frets = sc.nextInt();

		//PREGUNTA No DE CUERDAS
		System.out.println("hola, strings?");
		int strings = sc.nextInt();
		sc.nextLine();
		
		
		//PREGUNTA AFINACIÓN DE CADA CUERDA
		String[]stringNotation = new String[strings];
		for (int i = 0; i < strings; i++){
			System.out.println("tell me your string " + (i+1));
			stringNotation[i] = sc.nextLine();
			}
			
		//PREGUNTA MODALIDAD 
		System.out.println("Select mode! \n MAYOR / MENOR \n MENOR_ARM / MENOR_MEL");
		mode = sc.nextLine();
		switch (mode.toUpperCase()){
			case "MAYOR":
				none = MAYOR;
				break;
			case "MENOR":
				none = MENOR;
				break;
			case "MENOR_MEL":
				none = MENOR_MEL;
				break;
			case "MENOR_ARM":
				none = MENOR_ARM;
				break;
			}

		
		//PREGUNTA TONALIDAD 
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

		
		//IMPRIME INDX/NUMEROS
		System.out.println();
		for (int i = 0; i < frets; i++){
			if (i < 10)
				System.out.print(i + "_|");
			else 	
				System.out.print(i + "|");
		}

		//PARA CADA CUERDA
		for (int k = 0; k < strings; k++){
			System.out.println();
			System.out.print(stringNotation[k] + "}|" );
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
			
			//PARA CADA TRASTE
			for (int i = 1; i < frets; i++){
				int n = (i + stringShift - keyShift) % 12;
				boolean printed = false;
				for (int j = 0; j < none.length; j++){
					if (n == none[j] && !printed){
						if (notas[(n + keyShift) % 12].length() == 2)						
							System.out.print(notas[(n + keyShift) % 12] + "|");
						else 						
							System.out.print(notas[(n + keyShift) % 12] + " |");
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