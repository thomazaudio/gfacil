package util;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class Licensa {
	
	
	public Licensa(){
		
		lerLicensa();
	}

	private String vencimento;
	public String getVencimento() {
		return vencimento;
	}
	public void setVencimento(String vencimento) {
		this.vencimento = vencimento;
	}
	private String hash;

	
	public String getHash() {
		return hash;
	}
	public void setHash(String hash) {
		this.hash = hash;
	}
	
	
	public boolean isOK(String[] args) {

	
		if(this.getHash().equals(stringHexa(gerarHash(this.getVencimento()+"@Leghacy123", "MD5")))){
			
			if(System.currentTimeMillis()<DataUtil.formatData(this.getVencimento()).getTime()){
				
				return true;
			}
			else{
				
				return false;
			}
		}
		else {
			
			return false;
		}

	}


	private static String stringHexa(byte[] bytes) {
		StringBuilder s = new StringBuilder();
		for (int i = 0; i < bytes.length; i++) {
			int parteAlta = ((bytes[i] >> 4) & 0xf) << 4;
			int parteBaixa = bytes[i] & 0xf;
			if (parteAlta == 0) s.append('0');
			s.append(Integer.toHexString(parteAlta | parteBaixa));
		}
		return s.toString();
	}



	public static byte[] gerarHash(String frase, String algoritmo) {
		try {
			MessageDigest md = MessageDigest.getInstance(algoritmo);
			md.update(frase.getBytes());
			return md.digest();
		} catch (NoSuchAlgorithmException e) {
			return null;
		}
	}


	public  void lerLicensa() {

		String linha = null;
		try {
			FileReader arq = new FileReader("C:/siertech/cmd-license.dat");
			BufferedReader lerArq = new BufferedReader(arq);

			linha = lerArq.readLine(); // lê a primeira linha

			arq.close();
		} catch (IOException e) {
			System.err.printf("Erro na abertura do arquivo: %s.\n",
					e.getMessage());
		}
		
		
	
		String[] linhas = linha.split("@");
		this.vencimento = linhas[0];
		this.hash = linhas[1];
		
	
		
	}

	

	
	

}