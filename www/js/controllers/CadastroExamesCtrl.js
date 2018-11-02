﻿app.controller('CadastroExamesCtrl', function ($scope, ionicMaterialInk, $http, $ionicSideMenuDelegate, $ionicPopup, $ionicModal) {
	 // Verificando se o usuário está logado
	 $scope.usuarioLogado(true);
	 
	 $scope.exameData = {};
	 
	 // Lista de áreas 
	 $scope.listaAreas = [];
	 // Buscando os perfis cadastrados na base
	 $http({
		method: "GET",
	    timeout:$scope.timeout,
	    url: $scope.strUrlServico + Constantes.APP_SERVICE_EXAMES_LISTAR_AREAS,
	    headers: Util.headers($scope.token)
	 }).then(function(response) {
		 if(response.data.bolRetorno == true){
			 $scope.listaAreas = response.data.result;
		 }
	 }, function(response) {});
	 
	 // Lista de tipo de exames
	 $scope.listaTipoExames = [];
	 $http({
		method: "GET",
	    timeout:$scope.timeout,
	    url: $scope.strUrlServico + Constantes.APP_SERVICE_EXAMES_LISTAR_TIPOS_EXAMES,
	    headers: Util.headers($scope.token)
	 }).then(function(response) {
		 if(response.data.bolRetorno == true){
			 $scope.listaTipoExames = response.data.result;
		 }
	 }, function(response) {});
	 
	 /** **/
	 $ionicModal.fromTemplateUrl('templates/cadastrar-exames-confirmacao.html', {
		 scope: $scope
	 }).then(function(modal) {
		 $scope.modal = modal;
	 });
	 
	 $scope.closeConfirmar = function() {
		 $scope.modal.hide();
		 $(".disable-user-behavior").show();
		 $(".has-header").css("top", "44px");
		 $(".confirmarCadastro").attr("style", "background: #ffffff !important");
	 };
	  
	 $scope.confirmarCadastro = function() {
		 $scope.modal.show();
		 $(".confirmarCadastro").attr("style", "background: #62aaa2 !important");
		 $(".disable-user-behavior").hide();
		 $(".has-header").css("top", "0px");
	 };

	 /******* MÉTODO QUE IRÁ CALCULAR O PRAZO****************/
	 $scope.calcularPrazo = function(){
		 
		 if($scope.exameData.tipo_exame_id == undefined || $scope.exameData.tipo_exame_id == ""
			|| $scope.exameData.data_exame == undefined || $scope.exameData.data_exame == ""){
			
			 strMensagem = "";
			 if($scope.exameData.tipo_exame_id == undefined || $scope.exameData.tipo_exame_id == "")
				 strMensagem += "Tipo de Exame é obrigatório";
			 
			 if($scope.exameData.data_exame == undefined || $scope.exameData.data_exame == "")
				 strMensagem += "Data Coleta é obrigatório";
			 
			 var alertPopup = $ionicPopup.alert({
				title: 'Atenção',
				template: strMensagem
			 });
			alertPopup.then(function(res) { });
		 }else{
			 $scope.carregando();
			 
			 $http({
				method: "GET",
			    timeout:$scope.timeout,
			    url: $scope.strUrlServico 
			    	 + Constantes.APP_SERVICE_EXAMES_REUPERAR_PREVISAO_EXAME 
					 + "?intIdTipoExame=" + $scope.exameData.tipo_exame_id
					 + "&strDataColeta=" + $scope.exameData.data_exame,
			    headers: Util.headers($scope.token)
			 }).then(function(response) {
				 if(response.data.bolRetorno == true){
					 $scope.exameData.data_previsao = response.data.result.previsao;
				 }else{
					var alertPopup = $ionicPopup.alert({
						title: 'Atenção',
						template: response.data.strMensagem
					});
					alertPopup.then(function(res) { });
					$scope.exameData.data_previsao = "";
				 }
				 $scope.carregado();
			 }, function(response) {});
		 }
	 }
	 /******* FIM DO MÉTODO QUE IRÁ CALCULAR O PRAZO **************/
	 /*** MÉTODO DE SALVAR OS DADOS ****/
	 $scope.salvar = function(){
		
		// Disparando ação de load
		$scope.carregando();
		// Postando para URL
	 	$http({
			method: "POST",
		    timeout:$scope.timeout,
		    data: 'dadosExame=' + JSON.stringify($scope.exameData) + "&usuario_id="+$scope.loginData.id,
		    url: $scope.strUrlServico + Constantes.APP_SERVICE_EXAMES_CADASTRAR ,
		    headers: Util.headers($scope.token)
		})
		.then(function(response) {
			// Disparando ação de load
			$scope.carregado();
			bolRetorno = false;
			mensagem   = "";
			if(response.data.bolRetorno == true){
				bolRetorno = true;
				mensagem = "Cadastro Realizada Com Sucesso!";
			}else{
				mensagem = response.data.strMensagem;
			}
			
			var alertPopup = $ionicPopup.alert({
				title: (bolRetorno) ? 'Sucesso' : "Erro",
				template: mensagem
			});
			alertPopup.then(function(res) { });
			
			// Redirecionando para o inicio
			setTimeout(function(){
				// Redirecionado para o inicio
				if(bolRetorno){
					$scope.exameData = {};
					$scope.closeConfirmar();
				}
			}, 1500);
		}, function(response) {
			console.log(response);
			// Disparando ação de load
			$scope.carregado();
		});
	 }
	 /*** FIM MÉTODO SALVAR OS DADOS ***/
	 /** MÉTODO PARA VALIDAR AS INFORMAÇOES **/
	 $scope.validar = function(){
		 // Validando os campos 
		 var errosValidacao =  Util.validarCamposExames($scope.exameData);
	   	 // Caso haja algum erro
		 if(errosValidacao.bolErros){
		 	// Disparando ação de load
			$scope.carregado();
			// Abrindo dialog com erros
			var alertPopup = $ionicPopup.alert({
				title: 'Campo obrigatórios',
				template: errosValidacao.strMensagem
			});
			alertPopup.then(function(res) { });
			return false;
		 }
		 // Abrindo a tela de confirmação
		 $scope.confirmarCadastro();
	 }
	 /** FIM MÉTODO PARA VALIDAR AS INFORMAÇOES **/
});
