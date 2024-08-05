import java.util.Random;
import java.util.Base64;
  
public class TokenUtil {
  public static final String CHAR_LOWER = "abcdefghijklmnopqrstuvwxyz";
  
  public static final String NUMBERS = "1234567890";
  
  public static final String SYMBOLS = "!@#$%^&*()";
  
  public static final String CHARSET = "abcdefghijklmnopqrstuvwxyz" + "abcdefghijklmnopqrstuvwxyz".toUpperCase() + "1234567890" + "!@#$%^&*()";
  
  public static final int TOKEN_LENGTH = 42;  

  public static void main(String args[]) {
    int userId = Integer.parseInt(args[0]);
    long start = Long.parseLong(args[1]);
    long stop = Long.parseLong(args[2]);
  
    for (long l = start; l < stop; l++) {
      System.out.println(createToken(l, userId));
    }
  }
	
  public static String createToken(long seed, int userId) {
    Random random = new Random(seed);
    StringBuilder sb = new StringBuilder();
    byte[] encbytes = new byte[42];
    for (int i = 0; i < 42; i++)
      sb.append(CHARSET.charAt(random.nextInt(CHARSET.length()))); 
    byte[] bytes = sb.toString().getBytes();
    for (int j = 0; j < bytes.length; j++)
      encbytes[j] = (byte)(bytes[j] ^ (byte)userId); 
    return Base64.getUrlEncoder().withoutPadding().encodeToString(encbytes);
  }  
}
