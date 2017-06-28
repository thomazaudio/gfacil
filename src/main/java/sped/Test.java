package sped;
import java.io.BufferedWriter;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import coffeepot.br.sped.fiscal.arquivo.bloco0.Bloco0;
import coffeepot.br.sped.fiscal.arquivo.bloco0.Reg0000;
import coffeepot.br.sped.fiscal.arquivo.bloco0.Reg0001;
import coffeepot.br.sped.fiscal.tipos.IndicadorMovimento;
import coffeepot.br.sped.fiscal.writer.SpedFiscalWriter;

public class Test {

	public static void main(String args[]) throws IOException{


		//Criando o escritor do Sped Fiscal
		Writer fw = new BufferedWriter(new OutputStreamWriter(new FileOutputStream("c:\\sped\\reg"), "ISO-8859-1"));
		SpedFiscalWriter spedFiscalWriter = new SpedFiscalWriter(fw);

		Reg0000 reg = new Reg0000();
	
		//atribui os dados do registro
		reg.setCnpj("1111111111");
		reg.setCodMun(123);
		reg.setIe("123123123");
		reg.setUf("MG");
		reg.setCnpj("123123123123");
		reg.setSuframa("suf");

		//Escreve o registro no arquivo
		spedFiscalWriter.write(reg);

		Reg0001 reg1 = new Reg0001();
	
		//atribui os dados do registro
		reg1.setIndMov(IndicadorMovimento.COM_DADOS);
		

		//Escreve o registro no arquivo
		spedFiscalWriter.write(reg1);

		spedFiscalWriter.flush();
		spedFiscalWriter.close();
		
		
		//Criando o escritor do Sped Fiscal
		Writer fw2 = new BufferedWriter(new OutputStreamWriter(new FileOutputStream("c:\\sped\\bloco"), "ISO-8859-1"));
		SpedFiscalWriter spedFiscalWriter2 = new SpedFiscalWriter(fw2);

		Bloco0 bloco0 = new Bloco0();
		bloco0.setReg0000(reg);
		bloco0.setReg0001(reg1);
		

		//Escreve o bloco no arquivo
		spedFiscalWriter2.write(bloco0);

		spedFiscalWriter2.flush();
		spedFiscalWriter2.close();
		
	}
}
