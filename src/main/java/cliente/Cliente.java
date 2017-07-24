package cliente;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

import pedido.Pedido;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

import com.fasterxml.jackson.annotation.JsonView;

import util.Pessoa;

@Entity
@DiscriminatorValue("cliente")
@Getter @Setter
public class Cliente extends Pessoa {
    
	
	@JsonView(util.Views.Public.class)
	private String sugestoesProdutos;
	
	public String montaSugestoesProdutos(List<Pedido> pedidos){
		
	   String sugestoes="";
		
	   ArrayList<Long> novasSugestoes = new   ArrayList<Long>();
	   ArrayList<Long> sugestoesAntigas = new   ArrayList<Long>();
	   
	   for(Pedido p : pedidos){
		   
		   novasSugestoes.add(p.getProduto().getId());
	   }
	   
	   for(String a : sugestoes.split(",")){
		   
		   if(a.length()>0)
		   sugestoesAntigas.add(new Long(a));
	   }
	   
	   for(Long n : novasSugestoes){
		   
		   if(!sugestoesAntigas.contains(n))
		     sugestoesAntigas.add(n);
		   
	   }
	   
	   for(Long s : sugestoesAntigas ){
		   
		 sugestoes+=s+",";
	   }
	   
	   return sugestoes;
		
	}
	
	
}
