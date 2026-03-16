<html> 
	<head> 
		<title> TEST </title> 
	</head> 
	<body>
	<?php 
	function foo($A)
	{
	  static $counter = 0;
	  $counter++;

	  echo "<BR>";
	  echo $A;
	  echo "   ";
	  echo $counter;
	} 

	echo foo("hello");
	echo foo(100);
 
        ?>

    </body> 
</html>
