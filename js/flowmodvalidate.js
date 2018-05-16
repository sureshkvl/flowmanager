// Called by readForm to get key,value pairs for action set
function readKeyValueToObject(str1, str2, out) {
  $('tr').has(str1).each(function() {
    var $key = $(this).find(str1).val().trim();
    var $value = $(this).find(str2).val().trim();
    if ($value.indexOf('/') > 0) {
      $value = $value.split('/')
    }
    if($key != '') {
      out[$key] = $value;
    }
  });
}

// Called by readForm to get key,value pairs for action list
function readKeyValueToList(str1, str2, out) {
  $('tr').has(str1).each(function() {
    var $key = $(this).find(str1).val().trim();
    var $value = $(this).find(str2).val().trim();
    if($key != '') {
      var obj = {}; //TODO: simplify
      obj[$key] = $value;
      out.push(obj);
    }
  });
}

// Read form data
function readForm($form) {
  var formData = {};
  var $all = $form.find(':input');

  // Read switch ID
  formData['dpid'] = parseInt($('#dpid').val())

  // Read Flow Operation type
  var op = $('[name="operation"]:checked').val();
  formData['operation'] = op;
  
  // Read all fields of type=number
  var $nums = $all.filter('[type=number]');
  $nums.each( function() {
    var n = parseInt(this.value);
    formData[this.id] = isNaN(n) ? 0 : n;
  })
  // goto table must be > table_id

  // Read checkboxes
  var $ckb = $all.filter('[type=checkbox]');
  $ckb.each( function() {
    formData[this.id] = this.checked;
  })

  // Read Match fields and values
  var matchObj = {};
  if(!formData["matchcheckbox"]) {
    readKeyValueToObject('[name="matchfield"]', '[name="matchvalue"]', matchObj);
  }

  // Read Apply Actions fields and values
  var applyList = [];
  readKeyValueToList('[name="applyaction"]', '[name="applyvalue"]', applyList);

  // Read Write Actions fields and values
  var writeObj = {};
  readKeyValueToObject('[name="writeaction"]', '[name="writevalue"]', writeObj);

  formData.match = matchObj;
  formData.apply = applyList;
  formData.write = writeObj;

  return formData;
}

function toInt(fields, info, msg, flag) {
  var HINT = 1;
  for(var key in fields) {
    if (key ==='' || key == null || !(key in info)) {
      msg += 'Field ' + key + ' is undefined!';
      flag = false;
    } else {
        var isInt = info[key][HINT].indexOf('int') !== -1;
        if (isInt) {
          var num = parseInt(fields[key]);
          if (isNaN(num)) {
            flag = false;
            msg += 'Invalid value for field ' + key + "!";
          } else {
            fields[key] = num;
          }
        }
    }
  }
  flag = true;
}

// validates form input
function validate(formData, matchflds, actionflds) {
  var r = {"valid":{}, "message":"" };

  toInt(formData.match, matchflds, r.message, r.valid.match)
  toInt(formData.apply, actionflds, r.message, r.valid.apply)
  toInt(formData.match, actionflds, r.message, r.valid.write)

  return r;
}
