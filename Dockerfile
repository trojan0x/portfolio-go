FROM golang

ADD . /go/src/github.com/danybmx/portfolio-go

RUN go get github.com/danybmx/portfolio-go
RUN go install github.com/danybmx/portfolio-go

ENTRYPOINT /go/bin/portfolio-go

EXPOSE 3000
