CREATE TABLE `announce`(
	`id` int(10) UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
	`serv_name` varchar(255) DEFAULT NULL,
	`serv_type` varchar(255) DEFAULT NULL,
	`desc` varchar(255) DEFAULT NULL,
	`ipv4` varchar(255) DEFAULT NULL,
	`ipv6` varchar(255) DEFAULT NULL,
	`host` varchar(255) DEFAULT NULL,
	`mac` varchar(255) DEFAULT NULL,
	`ttl` int(20) DEFAULT 4500,
	`byte_buffer` varchar(255) DEFAULT NULL
)ENGINE=InnoDB DEFAULT CHARSET=latin1;
