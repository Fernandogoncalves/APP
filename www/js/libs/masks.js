$(document).ready(function(){
	setTimeout(function(){
		$('.data').mask('00/00/0000');
		$('.tempo').mask('00:00:00');
		$('.data_tempo').mask('00/00/0000 00:00:00');
		$('.cep').mask('00000-000');
		$('.tel').mask('00000-0000');
		$('.ddd_tel').mask('(00) 0000-00000');
		$('.cpf').mask('000.000.000-00');
		$('.cnpj').mask('00.000.000/0000-00');
		$('.dinheiro').mask('000.000.000.000.000,00' , { reverse : true});
		$('.dinheiro2').mask("#.##0,00" , { reverse:true});
	},1000);
});