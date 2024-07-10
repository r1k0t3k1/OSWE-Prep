On Error Resume Next
Set objWbemLocator = CreateObject("WbemScripting.SWbemLocator")

if Err.Number Then
	WScript.Echo vbCrLf & "Error # " & " " & Err.Description
End If
On Error GoTo 0	

On Error Resume Next
Select Case WScript.Arguments.Count
	Case 2
		
		strComputer = Wscript.Arguments(0)
		strQuery = Wscript.Arguments(1)
		Set wbemServices = objWbemLocator.ConnectServer(strComputer,"Root\CIMV2")
	
      
		
	Case 4
		strComputer = Wscript.Arguments(0)
		strUsername = Wscript.Arguments(1)
		strPassword = Wscript.Arguments(2)
		strQuery = Wscript.Arguments(3)
		Set wbemServices = objWbemLocator.ConnectServer(strComputer,"Root\CIMV2",strUsername,strPassword)
				
       case 6
               strComputer = Wscript.Arguments(0)
	       	strUsername = Wscript.Arguments(1)
	        strPassword = Wscript.Arguments(2)
	       	strQuery = Wscript.Arguments(4)
	       	namespace = Wscript.Arguments(5)
	       Set wbemServices = objWbemLocator.ConnectServer(strComputer,namespace,strUsername,strPassword)
	Case Else
		strMsg = "Error # in parameters passed"
		WScript.Echo strMsg
		WScript.Quit(0)
	
End Select



Set wbemServices = objWbemLocator.ConnectServer(strComputer, namespace, strUsername, strPassword)

if Err.Number Then
	WScript.Echo vbCrLf & "Error # "  & " " & Err.Description
End If

On Error GoTo 0

On Error Resume Next

Set colItems = wbemServices.ExecQuery(strQuery)

if Err.Number Then
	WScript.Echo vbCrLf & "Error # "  & " " & Err.Description
End If
On Error GoTo 0

i=0
For Each objItem in colItems
	if i=0 then
		header = ""
		For Each param in objItem.Properties_
			header = header & param.Name & vbTab
		Next
		WScript.Echo header
		i=1
	end if
	serviceData = ""
	For Each param in objItem.Properties_
		serviceData = serviceData & param.Value & vbTab
	Next
	WScript.Echo serviceData
Next

