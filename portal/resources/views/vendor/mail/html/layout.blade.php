<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <link href="https://fonts.googleapis.com/css2?family=Nunito" rel="stylesheet">
</head>
<body>
<style>
@media only screen and (max-width: 600px) {
.inner-body {
width: 100% !important;
}

.footer {
width: 100% !important;
}
}

@media only screen and (max-width: 500px) {
.button {
width: 100% !important;
}
}
</style>

<table class="wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
<tr>
<td align="center">
<table class="content" width="100%" cellpadding="0" cellspacing="0" role="presentation">

<!-- Email Body -->
<tr>
<td class="body" width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff">
<table style="padding-left: 80px !important; padding-right: 80px !important; background: transparent 0% 0% no-repeat padding-box; box-shadow: 0px 9px 23px #0000006B; border-radius: 39px; margin: 20px auto !important; width: 773px" class="inner-body" align="center" width="773" cellpadding="0" cellspacing="0" role="presentation">
<!-- Body content -->
  <tr>
    {{ $header ?? '' }}
    <td class="content-cell">
        {{ Illuminate\Mail\Markdown::parse($slot) }}
    </td>
    {{ $footer ?? '' }}
  </tr>
</table>
</td>
</tr>


</table>
</td>
</tr>
</table>
</body>
</html>
