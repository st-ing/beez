  function decodeUplink(input) {
    var bytes = input.bytes;
    var port = input.fPort;
    
    var decoded = {};
    var warnings = [];
  
    if (port == 1 || port == 2) // regular
    {
      // battery
      var bat = bytes[0]<<8 | bytes[1]; bat = 0.01 * bat; bat = Number(bat.toFixed(2));
      if (bat < 0.00 || bat > 5.00) bat = null;
      if (bat < 3.5) warnings.push("Battery low");
  
      decoded.Battery = bat;	
    
      // air
      decoded.Humidity = {};
      decoded.Temperature = {};
    
      // Ambient
      var humA = bytes[2]<<8 | bytes[3]; humA = 0.1 * humA; humA = Number(humA.toFixed(1));
      var temA = bytes[4]<<24>>16 | bytes[5]; temA = 0.1 * temA; temA = Number(temA.toFixed(1));
      
      if (humA < 0.0 || humA > 100.0) humA = null;
      if (temA < -50.0 || temA > 100.0 ) temA = null;
      
      if (bytes[2] == 0xFF && bytes[3] == 0xFF) humA = null;
      if (bytes[4] == 0xFF && bytes[5] == 0xFF) temA = null;
      
      if (humA == 0.0 && temA == 0.0) { humA = null; temA = null; } // temporar fix
      
      decoded.Humidity.Ambient = humA;
      decoded.Temperature.Ambient = temA;
      
      // Low
      var humL = bytes[6]<<8 | bytes[7]; humL = 0.1 * humL; humL = Number(humL.toFixed(1));
      var temL = bytes[8]<<24>>16 | bytes[9]; temL = 0.1 * temL; temL = Number(temL.toFixed(1));
      
      if (humL < 0.0 || humL > 100.0) humL = null;
      if (temL < -50.0 || temL > 100.0 ) temL = null;
      
      if (bytes[6] == 0xFF && bytes[7] == 0xFF) humL = null;
      if (bytes[8] == 0xFF && bytes[9] == 0xFF) temL = null;
      
      if (humL == 0.0 && temL == 0.0) { humL = null; temL = null; } // temporar fix
      
      decoded.Humidity.Low = humL;
      decoded.Temperature.Low = temL;
  
      // High
      var humH = bytes[10]<<8 | bytes[11]; humH = 0.1 * humH; humH = Number(humH.toFixed(1));
      var temH = bytes[12]<<24>>16 | bytes[13]; temH = 0.1 * temH; temH = Number(temH.toFixed(1));
      
      if (humH < 0.0 || humH > 100.0) humH = null;
      if (temH < -50.0 || temH > 100.0 ) temH = null;
      
      if (bytes[10] == 0xFF && bytes[11] == 0xFF) humH = null;
      if (bytes[12] == 0xFF && bytes[13] == 0xFF) temH = null;
      
      if (humH == 0.0 && temH == 0.0) { humH = null; temH = null; } // temporar fix
      
      decoded.Humidity.High = humH;
      decoded.Temperature.High = temH;
    }
  
    if (port == 2) // extension for weight
    {
      // weight
      var w = bytes[14]<<8 | bytes[15]; w = 0.1 * w; w = Number(w.toFixed(1));
  
      if (bytes[14] == 0xFF && bytes[15] == 0xFF) w = null;
      if (w < 0.0 || w > 1000.0) w = null;
  
      decoded.Weight = w;
    }
  
    if (port == 3) // test-demo
    {
      // battery
      var bat = bytes[4]<<8 | bytes[5]; bat = 0.01 * bat; bat = Number(bat.toFixed(2));
      
      if (bat < 0.00 || bat > 5.00) bat = null;
      if (bat < 3.5) warnings.push("Battery low");
        
      decoded.Battery = bat;  
      
      // air
      decoded.Humidity = {};
      decoded.Temperature = {};
    
      var hum = bytes[0]<<8 | bytes[1]; hum = 0.1 * hum; hum = Number(hum.toFixed(1));
      var tem = bytes[2]<<24>>16 | bytes[3]; tem = 0.1 * tem; tem = Number(tem.toFixed(1));
      
      if (hum == 0.0 && tem == 0.0) { hum = null; tem = null; } // temporar fix
      
      if (hum < 0.0 || hum > 100.0) hum = null;
      if (tem < -50.0 || tem > 100.0 ) tem = null;
  
      decoded.Humidity.Ambient = hum;
      decoded.Temperature.Ambient = tem;
    }
    
    if (port == 4) // 3+1 channel
    {
      decoded.Humidity = {};
      decoded.Temperature = {};
      
      //
      var humA = bytes[0]<<8 | bytes[1]; humA = 0.1 * humA; humA = Number(humA.toFixed(1));
      var temA = bytes[2]<<24>>16 | bytes[3]; temA = 0.1 * temA; temA = Number(temA.toFixed(1));
      
      if (humA < 1.0 || humA > 100.0) humA = null;
      if (temA < -50.0 || temA > 100.0 ) temA = null;
      if (humA == null && temA == 0.0 ) temA = null;
      
      decoded.Humidity.Ambient = humA;
      decoded.Temperature.Ambient = temA;
      
      //
      var humH = bytes[4]<<8 | bytes[5]; humH = 0.1 * humH; humH = Number(humH.toFixed(1));
      var temH = bytes[6]<<24>>16 | bytes[7]; temH = 0.1 * temH; temH = Number(temH.toFixed(1));
      
      if (humH < 1.0 || humH > 100.0) humH = null;
      if (temH < -50.0 || temH > 100.0 ) temH = null;
      if (humH == null && temH == 0.0 ) temH = null;
  
      decoded.Humidity.High = humH;
      decoded.Temperature.High = temH;
      
      //
      var humM = bytes[8]<<8 | bytes[9]; humM = 0.1 * humM; humM = Number(humM.toFixed(1));
      var temM = bytes[10]<<24>>16 | bytes[11]; temM = 0.1 * temM; temM = Number(temM.toFixed(1));
      
      if (humM < 1.0 || humM > 100.0) humM = null;
      if (temM < -50.0 || temM > 100.0 ) temM = null;
      if (humM == null && temM == 0.0 ) temM = null;
  
      decoded.Humidity.Medium = humM;
      decoded.Temperature.Medium = temM;
      
      //
      var humL = bytes[12]<<8 | bytes[13]; humL = 0.1 * humL; humL = Number(humL.toFixed(1));
      var temL = bytes[14]<<24>>16 | bytes[15]; temL = 0.1 * temL; temL = Number(temL.toFixed(1));
      
      if (humL < 1.0 || humL > 100.0) humL = null;
      if (temL < -50.0 || temL > 100.0 ) temL = null;
      if (humL == null && temL == 0.0 ) temL = null;
  
      decoded.Humidity.Low = humL;
      decoded.Temperature.Low = temL;
      
      //
      var bat = bytes[16]<<8 | bytes[17]; bat = 0.01 * bat; bat = Number(bat.toFixed(2));
      if (bat < 0.00 || bat > 5.00) bat = null;
   
      if (bat < 3.5)
        warnings.push("Battery low");
  
      decoded.Battery = bat;
   }
   
   return {
      data: decoded,
      warnings: warnings,
      errors: []
    };
  }