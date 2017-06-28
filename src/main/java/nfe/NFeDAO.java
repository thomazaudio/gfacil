package nfe;
import java.lang.reflect.Modifier;
import java.util.Date;

import javax.xml.bind.JAXBException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import br.inf.portalfiscal.nfe.schema.envinfe.TEnviNFe;
import br.inf.portalfiscal.nfe.schema.envinfe.TNFe;
import br.inf.portalfiscal.nfe.schema.envinfe.TNFe.InfNFe;
import br.inf.portalfiscal.nfe.schema.envinfe.TNFe.InfNFe.Det;
import br.inf.portalfiscal.nfe.schema.envinfe.TRetEnviNFe;
import cliente.ClienteService;
import model.GenericDAO;
import movimentacao.MovimentacaoService;
import util.DataUtil;

@Repository
public class NFeDAO extends GenericDAO<NFe> {


	@Autowired
	private MovimentacaoService movService;

	@Autowired
	private ClienteService clienteService;

	public NFeDAO() {
		super(NFe.class);
		// TODO Auto-generated constructor stub
	}


	@Override
	public NFe addOrUpdate(NFe nfe) {


		TNFe tNFe = new TNFe();  

		InfNFe infNFe = nfe.getInfNFe();


		//Cálculo dos totais

		//Calulo dos impostos de produtos


		//Versão da NFe
		infNFe.setVersao("3.10");   


		//Data e mês de emissão
		if(infNFe.getIde().getDhEmi()==null)
			infNFe.getIde().setDhEmi(DataUtil.getFormated(new Date()));

		//Seta a chave da NFe
		//infNFe.setId(NFeUtil.getChaveAcesso(infNFe)); 


		System.out.println("Chave da NFe: "+infNFe.getId());


		tNFe.setInfNFe(infNFe);

		//Montagem do objeto de envio da NFe
		TEnviNFe enviNFe = new TEnviNFe();    
		enviNFe.setVersao("3.10");    
		enviNFe.setIdLote("0000001");   
		enviNFe.setIndSinc("1"); 
		enviNFe.getNFe().add(tNFe); 

		//Atualização das informações dentro do objeto persistente
		nfe.setChaveNFE(infNFe.getId());
		nfe.setVersao(infNFe.getVersao());
		nfe.setModelo(infNFe.getIde().getMod());

		if(infNFe.getDest().getCPF()!=null)
			nfe.setDocDest(infNFe.getDest().getCPF());

		else if(infNFe.getDest().getCNPJ()!=null)
			nfe.setDocDest(infNFe.getDest().getCNPJ());

		else new NFeException("CNPJ e CPF não definido para o destinatário").printStackTrace();


		if(infNFe.getEmit().getCPF()!=null)
			nfe.setDocEmit(infNFe.getEmit().getCPF());

		else if(infNFe.getEmit().getCNPJ()!=null)
			nfe.setDocEmit(infNFe.getEmit().getCNPJ());

		else new NFeException("CNPJ e CPF não definido para o emitente").printStackTrace();;

		//Atualiza a String de xml contendo as informações da NFe
		//nfe.setXmlNFe(NFeUtil.strValueOf(enviNFe));


		//Salva a movimentaçõ correspondente
		if(nfe.getMovimentacao()!=null)
			movService.addOrUpdate(nfe.getMovimentacao());

		
		
	

		return super.addOrUpdate(nfe);

	}




	//Recupera as informações persistidas da NFe e o xml infNFe
	//O id se refere ao objeto persistente (NFe)
	@Override
	public NFe getById(long id){

		NFe nfe = super.getById(id);


		//Informações da NFe
		TEnviNFe enviNFe= new TEnviNFe();
		try {
			//enviNFe = (TEnviNFe)  NFeUtil.xmlToObject(nfe.getXmlNFe(), TEnviNFe.class);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		//Seta as informações presente no XML	
		if(enviNFe!=null && enviNFe.getNFe()!=null && enviNFe.getNFe().get(0)!=null){	


			Gson gson = new GsonBuilder()
					.excludeFieldsWithModifiers(Modifier.FINAL, Modifier.TRANSIENT, Modifier.STATIC)
					.serializeNulls()
					.create();

			InfNFe inf = enviNFe.getNFe().get(0).getInfNFe();

			//Remove o cálculo de impostos dos produtos

			/*
			for(var i in inf.det){

				inf.det[i].imposto = null;
			}

			 */

			//Esses dados devem ser recalculados a cada edição da nota
			for(Det det: inf.getDet()){

				//det.setImposto(null);
				//det.setImpostoDevol(null);
			}

			String infString = gson.toJson(inf);

			nfe.setInfNFe(gson.fromJson(infString,InfNFe.class));


		}

		return nfe;

	}


	//Criar uma NFe básica
	//Define cNF
	//define nNf
	//Define a chave de acesso
	public  InfNFe criaNFeBasica(InfNFe nfe){

		//Define cNF 
		nfe.getIde().setCNF("0");

		//define o numero da nota Fiscal
		//nfe.getIde().setNNF(value);

		//Define a chave de acesso
		//nfe.setId(NFeUtil.getChaveAcesso(nfe));

		return nfe;
	}




}
