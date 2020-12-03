FROM ubuntu:18.04
WORKDIR /usr/src/app
RUN set -ex && apt-get update 

## for apt to be noninteractive
ENV DEBIAN_FRONTEND noninteractive
ENV DEBCONF_NONINTERACTIVE_SEEN true

## preesed tzdata, update package index, upgrade packages and install needed software
RUN echo "tzdata tzdata/Areas select Europe" > /tmp/preseed.txt; \
    echo "tzdata tzdata/Zones/Europe select Berlin" >> /tmp/preseed.txt; \
    debconf-set-selections /tmp/preseed.txt && \
    apt-get update && \
    apt-get install -y tzdata
RUN touch /hex_packet.txt && chmod 777 /hex_packet.txt
RUN touch /hex_packet_verbose.txt && chmod 777 /hex_packet_verbose.txt
RUN touch /ip.csv && chmod 777 /ip.csv
RUN touch /announce.csv && chmod 777 /announce.csv
RUN touch /withdraw.csv && chmod 777 /withdraw.csv
RUN touch /browse.csv && chmod 777 /browse.csv
RUN touch /browse_service.csv && chmod 777 /browse_service.csv
RUN touch /log.txt && chmod 777 /log.txt
RUN echo '*' > /etc/mdns.allow 
RUN chmod 777 /ip.csv
RUN sed -i "s/hosts:.*/hosts:          files mdns4 dns/g" /etc/nsswitch.conf
RUN apt-get install -y git \
    libtool \
    expat \
    libgdbm-dev \
    libdaemon-dev \
    doxygen \
    gtk+2.0 \
    mono-mcs \
    xmltoman \
    qt5-default \
    m4 \
    glib2.0 \
    dbus \
    glade \
    pkg-config \
    libevent-dev \
    systemd \
    nano \
    npm
COPY package*.json ./
RUN npm install
COPY . .
WORKDIR /usr/src/app/avahi
RUN ./autogen.sh --disable-python
RUN ./configure --sysconfdir=/etc --localstatedir=/var --disable-python
RUN make && make install
RUN ldconfig
RUN addgroup --system avahi
RUN adduser --system --no-create-home --ingroup avahi avahi
WORKDIR /usr/src/app
ENTRYPOINT [ "bash", "./entrypoint.sh" ]
CMD ["npm", "start"]
#CMD [ "/bin/bash" ]