"user strict";
(function(){

	angular.module("adm") 

	.directive("stInput",function($compile,$filter, stService,$rootScope,stUtil){

		return {
			require:'ngModel',	

			scope:{

				tipo:"@",
				label:"=",
				disable:"@",
				objectOp:"@",//Objeto em caso de chave/valor
				optionsChosen:"@",
				html:"@",
				dateFormat:"=",
				savePath:"=",
				saveObject:"="
			},


			link: function($scope, element, attrs,ctrl){

				/*
				//Mudança para salvar
				if($scope.saveObject && $scope.savePath){



					var inputGroup = $compile("<div class='input-group'></div>")($scope);

					element.before(inputGroup);

					inputGroup.append(element);

					var buttonSave = $compile("<button class='btn btn-info'><i class='fa fa-floppy-o'></i></button>")($scope);
					var spanButton = $compile("<span class='input-group-btn'></div>")($scope);
					spanButton.append(buttonSave);
					inputGroup.append(spanButton);

					console.log(inputGroup);
					element.bind("keyup",function(){

					});
				}

				 */


				//Focus automático
				if($scope.tipo!='data')	{
					element.bind("mouseover",function(){

						element.focus();
						var $thisVal = element.val();
						element.val('').val($thisVal);

					});
				}

				{html:'<button></button>'}

				if($scope.tipo=='htmlCompile'){


					var content = $compile($scope.html)($scope);
					element.html(content);
				}		

				if($scope.tipo=='htmlView'){


					var content = $compile($scope.html)($scope);
					element.append(content);
				}	

				else if($scope.tipo=='checkbox'){

					element.attr('type',"checkbox");
					element.attr('class','checkbox');

				}

				else if($scope.tipo=='popover'){

					var button = $compile('<button style="z-index:99999"  type="button" class="btn btn-primary btn-lg" id="myPopover" data-toggle="popover">HTML Inside Popover</button>')($scope);
					//Função para Abrir Popover
					$(button).popover({
						//placement : 'top',
						title: '<p><strong>Cadastrar Nova Pessoa/Empresa</strong></p>',
						content : '<p style="font-size:9pt">Digite abaixo o nome da Pessoa/Empresa que deseja cadastrar.</p><div class="form-group"><input class="form-control" placeholder="Digite o nome da Pessoa/Empresa"/></div><div class="form-group"><button class="btn btn-danger pull-left" onclick="$(&quot;#myPopover&quot;).popover(&quot;hide&quot;);" >Fechar</button><button class="btn btn-primary pull-right">Salvar</button></div><div class="row"></div',
						html: true
					}); 
					element.append(button);  
				}



				else  if($scope.tipo=='tel'){

					element.attr("type","tel");
					element.mask("(99) 9999-9999?9");
				}

				else if($scope.tipo=='cpf'){
					element.mask("999.999.999-99");
				}

				else if($scope.tipo=='cnpj'){

					element.mask("99.999.999/9999-99");
				}

				//Nomes proprios
				else if($scope.tipo=='upper'){


					$(element).keyup(function(){

						this.value = this.value.toLocaleUpperCase();
						ctrl.$setViewValue(this.value.toLocaleUpperCase());
					});


				}


				else if($scope.tipo=='money'){

					/*
					element.attr("type","tel");
					element.bind("keyup",function(){

                    var valor = ctrl.$viewValue;

						if(valor<100 && valor.indexOf(".")==-1){


						}else{

							valor  = valor.replace(".","");
							valor  = valor.replace(" ","");
							valor = valor/100;
						}


						ctrl.$setViewValue(valor);

						$scope.$apply();

					});


					element.maskMoney();

					 */
				}

				else if($scope.tipo=='monthPicker'){

					element.datepicker( {

						onSelect:function(value){
							showButtonPanel: true
						}


					});

					element.bind('click',function(){

						ctrl.$setViewValue(element.val());
						ctrl.$render();
					});

				}


				if($scope.tipo=='time'){

					element.datepicker({
						dateFormat: 'HH:mm:ss',
						"z-index":9999,
						onSelect: function (date) {
							ctrl.$setViewValue(date);
						}
					});
				}

				if($scope.tipo=='data'){

					var format = $scope.dateFormat;



					$(element).focus(function(){

						this.blur();
					});


					if(format && format=='MM/yyyy'){

						element.MonthPicker();

					}

					else {

						element.datepicker({
							dateFormat: 'dd/mm/yy',
							"z-index":9999,
							onSelect: function (date) {
								ctrl.$setViewValue(date);
							}
						});


					}

				}



				element.bind("keyup",function(value){

					if($scope.tipo=='data')	{

						ctrl.$setViewValue(_formatDate(ctrl.$viewValue));

						ctrl.$render();

					}

				});

				//Interceptador de Valores
				ctrl.$parsers.push(function(value){

					if($scope.tipo=='data')
						value = $filter("date")(value,"dd/MM/yyyy");

					else if($scope.tipo=='time')
						value = $filter("date")(value,"HH:mm:ss");


					return value;
				});

				//Filtros
				ctrl.$formatters.push(function(value){

					if($scope.tipo=='data'){
						value = $filter("date")(value,"dd/MM/yyyy");
						ctrl.$setViewValue(value);
						ctrl.$render();
					}

					else if($scope.tipo=='time'){
						value = $filter("date")(value,"HH:mm:ss");
						ctrl.$setViewValue(value);
						ctrl.$render();
					}




					return value;

				});


				//Formatação de datas
				var _formatDate = function(data){

					data = data.replace(/[^0-9]+/g,"");

					if(data.length>2){
						data = data.substring(0,2) +"/" +data.substring(2); 
					}

					if(data.length >5){
						data = data.substring(0,5) +"/" +data.substring(5,9); 
					}

					return data;

				}

			}


		}


	})

})();
