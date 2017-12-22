-- MySQL dump 10.13  Distrib 5.7.12, for Win64 (x86_64)
--
-- Host: localhost    Database: db_31993901343
-- ------------------------------------------------------
-- Server version	5.5.51-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `config`
--

DROP TABLE IF EXISTS `config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `config` (
  `id` bigint(20) NOT NULL,
  `formaPagamentoPadrao` varchar(255) DEFAULT NULL,
  `modoOperacao` int(11) NOT NULL,
  `nomeEmpresa` varchar(255) DEFAULT NULL,
  `telefone` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `config`
--

LOCK TABLES `config` WRITE;
/*!40000 ALTER TABLE `config` DISABLE KEYS */;
INSERT INTO `config` VALUES (1,NULL,0,'Philipe (Usuário 223)',NULL);
/*!40000 ALTER TABLE `config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `config_confs`
--

DROP TABLE IF EXISTS `config_confs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `config_confs` (
  `Config_id` bigint(20) NOT NULL,
  `confs` varchar(255) DEFAULT NULL,
  `confs_KEY` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`Config_id`,`confs_KEY`),
  KEY `FK293B76B247F4D2C6` (`Config_id`),
  CONSTRAINT `FK293B76B247F4D2C6` FOREIGN KEY (`Config_id`) REFERENCES `config` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `config_confs`
--

LOCK TABLES `config_confs` WRITE;
/*!40000 ALTER TABLE `config_confs` DISABLE KEYS */;
INSERT INTO `config_confs` VALUES (1,'maisVendidos','sugestaoProdutosPDV'),(1,'beep1.wav','beepPdv'),(1,'Belo Vale','endereco'),(1,'true','escolhaClientePdv'),(1,'dinheiro','formaPagamentoPadrao'),(1,'logo-sier.png','imgProfile'),(1,'1','inicio_semana'),(1,',Despesas em atraso,Recebimentos em atraso,Produtos com estoque baixo,Produtos mais vendidos','itensDashboard'),(1,'balanco,lancamentos_anteriores_baixados,vendas_tabela,entrada_dia_semana,','itensRelatorio'),(1,'20','maxItensPage'),(1,'2','modoOperacao'),(1,'Pessoas,Logística Reversa,Estoque,Financeiro,Relatorios,','modulos'),(1,'SierTech','nomeUsuario'),(1,'pdvficha','tipoPdv'),(1,'http://192.168.43.82:1220','urlImpressoraCupom');
/*!40000 ALTER TABLE `config_confs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `config_modulos_usuario`
--

DROP TABLE IF EXISTS `config_modulos_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `config_modulos_usuario` (
  `modulo_id` bigint(20) NOT NULL,
  `modulo` varchar(255) DEFAULT NULL,
  KEY `FK7B71CAAF1B697312` (`modulo_id`),
  CONSTRAINT `FK7B71CAAF1B697312` FOREIGN KEY (`modulo_id`) REFERENCES `config` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `config_modulos_usuario`
--

LOCK TABLES `config_modulos_usuario` WRITE;
/*!40000 ALTER TABLE `config_modulos_usuario` DISABLE KEYS */;
INSERT INTO `config_modulos_usuario` VALUES (1,'Pdv Ficha'),(1,'Pessoas'),(1,'Estoque'),(1,'Financeiro'),(1,'Relatorios');
/*!40000 ALTER TABLE `config_modulos_usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `opcao`
--

DROP TABLE IF EXISTS `opcao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `opcao` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `descricao` varchar(255) DEFAULT NULL,
  `valor` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `opcao`
--

LOCK TABLES `opcao` WRITE;
/*!40000 ALTER TABLE `opcao` DISABLE KEYS */;
INSERT INTO `opcao` VALUES (1,'categoria_conta_pagar','Higienização caixa plástica'),(2,'categoria_conta_pagar','Aluguel caixa plástica'),(3,'categoria_conta_pagar','Lanches'), (4,'categoria_conta_pagar','Gastos com Combustível');
/*!40000 ALTER TABLE `opcao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pessoa`
--

DROP TABLE IF EXISTS `pessoa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pessoa` (
  `tipo_pessoa` varchar(31) NOT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `dataCadastro` date DEFAULT NULL,
  `disable` int(11) NOT NULL,
  `doc` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `endereco` varchar(255) DEFAULT NULL,
  `login` varchar(255) DEFAULT NULL,
  `nome` varchar(255) DEFAULT NULL,
  `observacoes` varchar(255) DEFAULT NULL,
  `permissoes` varchar(255) DEFAULT NULL,
  `pin` varchar(255) DEFAULT NULL,
  `senha` varchar(255) DEFAULT NULL,
  `telefone` varchar(255) DEFAULT NULL,
  `tipoDoc` int(11) NOT NULL,
  `dataAdmissao` date DEFAULT NULL,
  `diasEntrega` int(11) DEFAULT '1',
  `id_operador` bigint(20) DEFAULT NULL,
  `defaultPassword` tinyint(1) NOT NULL,
   `allFilials` int(11) NOT NULL,

  PRIMARY KEY (`id`),
  UNIQUE KEY `login` (`login`),
  UNIQUE KEY `pin` (`pin`),
  KEY `FKC4E40FA7D691AA6B` (`id_operador`),
  CONSTRAINT `FKC4E40FA7D691AA6B` FOREIGN KEY (`id_operador`) REFERENCES `pessoa` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pessoa`
--

LOCK TABLES `pessoa` WRITE;
/*!40000 ALTER TABLE `pessoa` DISABLE KEYS */;
INSERT INTO `pessoa` (`id`,`tipo_pessoa`, `disable`, `doc`, `tipoDoc`, `defaultPassword`,`nome`,`allFilials` ) VALUES (1,'operador_sistema', 0, 'null', '0','0','Admin',1);
INSERT INTO `pessoa` (`tipo_pessoa`, `disable`, `doc`, `tipoDoc`, `defaultPassword`,`nome`,`allFilials` ) VALUES ('cliente', 0, 'null', '0','0','OUTROS',1);
/*!40000 ALTER TABLE `pessoa` ENABLE KEYS */;
UNLOCK TABLES;

INSERT INTO `db_apresentacao`.`filial` (`bloqueada`, `nome`, `tipoDoc`, `xFant`, `xNome`,  `allFilials`) VALUES ('0', 'Fazenda SP', '1', 'Fazenda SP', 'Fazenda SP',1);


--
-- Table structure for table `produto`
--


-- Dumping data for table `produto`
--

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-10-16 22:38:47
