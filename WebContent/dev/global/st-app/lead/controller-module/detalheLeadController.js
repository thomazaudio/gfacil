"use strict";
(function(){
	angular.module("adm") 

	.controller("detalheLeadController",function(lead, stService, dateUtil, movUtil, $rootScope, $modalInstance, stUtil, leadUtil, $route){
		
		var vm = this;
		vm.emailTemplates = [
		   {
			   titulo:"Demonstração remota",
			   assunto:"Demonstração - CeasaPlus",
			   html: "<h3>Olá <strong>LEAD_NOME!</strong></h3>"+
                         "<p>Para que eu possa iniciar a demonstração é só você baixar o programa,  executar, e me informar o ID que aparecerá na tela.</p>"+
                            "<a href='https://anydesk.pt/download'>Clique aqui para baixar o programa</a>"
		                    	  
		    }               
		];

		var qs  = $rootScope.config.confs.questoesLead.split(",");
		vm.questions = [];

		for(var i in qs){
			var _attr = qs[i].toLowerCase();
			_attr = _attr.split(" ").join("_");
			vm.questions.push({label: qs[i], attr: _attr});
		}
		
		vm.changeEmailTemplate = function(template){
			
			var html = template.html;
			html = html.replace("LEAD_NOME", lead.nome.split(" ")[0]);
			vm.assuntoEmail = template.assunto;
			vm.contentEmail = html;	
			console.log("Email template: ");
			console.log(html);
		}
		
		vm.getEmailTemplates = function(){
			
			stService.getAll("/emailtemplate").success(function(data){
				
				vm.emailTemplates  = data.itens;
			});
		}

		vm.enviarEmail = function(assunto_, content_){

			if(!content_ || content_.length==0){

				stUtil.showMessage("","Defina um conteúdo para o email","danger");
				return;
			}

			if(!vm.lead.email || vm.lead.email.indexOf("@")==-1 || vm.lead.email.indexOf(".com")==-1){

				stUtil.showMessage("","O email do lead não está cadastrado ou é inválido","danger");
				return;
			}
			
			vm.enviandoEmail = true;

			stService.executeGet("/send-email", {destinatario: vm.lead.email ,assunto: assunto_, content: content_}).success(function(res){
				if(res==true)
					stUtil.showMessage("","Email enviado com sucesso!");
				else 
					stUtil.showMessage("","Ocorreu um erro ao enviar o email!","danger");

				vm.enviandoEmail = false;

			}).error(function(){
				vm.enviandoEmail  = false;
				stUtil.showMessage("","Ocorreu um erro ao enviar o email!","danger");
			});

		}
		
		vm.deletarLead = function(lead){
			
			stService.executePost("lead/delete/",[lead.id]).success(function(data){

				stUtil.showMessage("","Deletado com sucesso");
				$route.reload();

			});
		}


		vm.enviarSMS = function(sms){

			if(!sms|| sms.length==0){

				stUtil.showMessage("","Defina um conteúdo para o sms","danger");
				return;
			}

			if(!vm.lead.telefone){

				stUtil.showMessage("","O telefone do lead não está cadastrado ou é inválido","danger");
				return;
			}
			
			vm.enviandoSMS = true;

			stService.executeGet("/send-sms", {mensagem: sms, numero: vm.lead.telefone}).success(function(res){
				if(res==true)
					stUtil.showMessage("","SMS enviado com sucesso!");
				else 
					stUtil.showMessage("","Ocorreu um erro ao enviar o SMS!","danger");

				vm.enviandoSMS = false;

			}).error(function(){
				vm.enviandoSMS  = false;
				stUtil.showMessage("","Ocorreu um erro ao enviar o SMS!","danger");
			});

		}

		vm.lead = lead;
		vm.lead.horaApresentacao = new Date(vm.lead.horaApresentacao);
		if(vm.lead.dataApresentacao==0)
			vm.lead.dataApresentacao = null;

		if(vm.lead.dataUltimaEtapa)
		   vm.diasUltimaEtapaLead = dateUtil.daysBetween(dateUtil.getDate(vm.lead.dataUltimaEtapa), new Date().getTime());

		vm.atualizarLead = function(){
			stService.getById("lead", vm.lead.id).success(function(data){
				stUtil.showMessage("","Atualizado com sucesso!");
				vm.lead = data.item;
				vm.lead.horaApresentacao = new Date(vm.lead.horaApresentacao);
				console.log("hora: ");
				console.log(new Date(vm.lead.horaApresentacao));
			});
		}
		vm.salvar = function(lead){
			
			console.log("horaApresentação: ");
			console.log(lead.horaApresentacao);
		
			
			if(lead.dataApresentacao)
				lead.dataApresentacao= dateUtil.getDate(lead.dataApresentacao).getTime();
			else
				lead.dataApresentacao =0;
				
			
			stService.executePost("lead/add/",lead).success(function(data){

				stUtil.showMessage("","Salvo com sucesso!");
				vm.lead = data.item;
				vm.lead.horaApresentacao = new Date(vm.lead.horaApresentacao);
			});

		},

		vm.changeEtapaLead = function(lead){

			lead.dataUltimaEtapa =  new Date().getTime();
			vm.salvar(lead);

		}

	})

})();
