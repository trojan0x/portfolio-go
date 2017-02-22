FROM golang

ADD . /go/src/github.com/danybmx/portfolio-go

RUN go get github.com/danybmx/portfolio-go
RUN go install github.com/danybmx/portfolio-go

RUN ln -s /go/src/github.com/danybmx/portfolio-go/static /go/bin/static
ENTRYPOINT /go/bin/portfolio-go

EXPOSE 3000
