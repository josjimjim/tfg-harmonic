export const GRAVITY = 9.81;

export function euler(f, x, v , t, h){
    //TODO
    return [x, v, t];
}

export function rungeKutta4(f, x, v , t, h){
    var k1, k2, k3, k4;
    var l1, l2, l3, l4;

    k1=h*v;
    l1=h*f(x, v, t);
    k2=h*(v+l1/2);
    l2=h*f(x+k1/2, v+l1/2, t+h/2);
    k3=h*(v+l2/2);
    l3=h*f(x+k2/2, v+l2/2, t+h/2);
    k4=h*(v+l3);
    l4=h*f(x+k3, v+l3, t+h);
    x+=(k1+2*k2+2*k3+k4)/6;
    v+=(l1+2*l2+2*l3+l4)/6;
    t+=h;

    return [x, v, t];
}

export function rungeKuttaFehlberg(f, x, v , t, h){
    //TODO
    return [x, v, t];
}

export function adamsBashforth2(f, x, v , t, h){
    //TODO
    return [x, v, t];
}

export function adamsBashforth4(f, x, v , t, h){
    //TODO
    return [x, v, t];
}
