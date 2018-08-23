export const GRAVITY = 9.81;

export const NUMERICAL_METHODS = [
  {method:'euler', name: 'Euler Method'},
  {method:'heun', name: 'Heun\'s Method'},
  {method:'rungeKutta4', name: 'Runge-Kutta 4 Steps'},
  {method:'rungeKuttaFehlberg45', name: 'Runge-Kutta-Fehlberg 4&5 Steps'}
];

export const ERROR_TOLERANCE = 0.0002;

/**
  * All this methods return a tuple of three elements:
  *   x: position
  *   v: velocity
  *   h: step
  *
  * It's preferred to return the step instead of time if we want to apply
  * an adaptive step.
  */
export function numericalResolution(f, t, x, v, h){
  return {
    "euler": euler(f, t, x, v, h),
    "heun": heun(f, t, x, v, h),
    "rungeKutta4": rungeKutta4(f, t, x, v, h),
    "rungeKuttaFehlberg45": rungeKuttaFehlberg45(f, t, x, v, h),
  };
}

export function euler(f, t, x, v, h){
  v+=h*f(t, x, v);
  x+=h*v;

  return [x, v, h];
}

export function heun(f, t, x, v, h){
  let k1, k2;
  let l1, l2;

  k1=h*v;
  l1=h*f(t, x, v);
  k2=h*(v+l1);
  l2=h*f(t+h, x+k1, v+l1);
  x+=(k1+k2)/2;
  v+=(l1+l2)/2;

  return [x, v, h];
}

export function rungeKutta4(f, t, x, v, h){
  let k1, k2, k3, k4;
  let l1, l2, l3, l4;

  k1=h*v;
  l1=h*f(t, x, v);
  k2=h*(v+l1/2);
  l2=h*f(t+h/2, x+k1/2, v+l1/2);
  k3=h*(v+l2/2);
  l3=h*f(t+h/2, x+k2/2, v+l2/2);
  k4=h*(v+l3);
  l4=h*f(t+h ,x+k3, v+l3);
  x+=(k1+2*k2+2*k3+k4)/6;
  v+=(l1+2*l2+2*l3+l4)/6;

  return [x, v, h];
}

export function rungeKuttaFehlberg45(f, t, x, v, h){
  let k1, k2, k3, k4, k5, k6;
  let l1, l2, l3, l4, l5, l6;
  let s;

  k1=h*v;
  l1=h*f(t, x, v);
  k2=h*(v+l1/4);
  l2=h*f(t+h*1/4, x+k1/4, v+l1/4);
  k3=h*(v+l1*3/32+l2*9/32);
  l3=h*f(t+h*3/8, x+k1*3/32+k2*9/32, v+l1*3/32+l2*9/32);
  k4=h*(v+l1*1932/2197-l2*7200/2197+l3*7296/2197);
  l4=h*f(t+h*12/13, x+k1*1932/2197-k2*7200/2197+k3*7296/2197, v+l1*1932/2197-l2*7200/2197+l3*7296/2197);
  k5=h*(v+l1*439/216-l2*8+l3*3680/513-l4*845/4104);
  l5=h*f(t+h, x+k1*439/216-k2*8+k3*3680/513-k4*845/4104, v+l1*439/216-l2*8+l3*3680/513-l4*845/4104);
  k6=h*(v-l1*8/27+l2*2-l3*3544/2565+l4*1859/4104-l5*11/40);
  l6=h*f(t+h/2, x-k1*8/27+k2*2-k3*3544/2565+k4*1859/4104-k5*11/40, v-l1*8/27+l2*2-l3*3544/2565+l4*1859/4104-l5*11/40);

  x+=(k1*25/216+k3*1408/2565+k4*2197/4101-k5/5);
  v+=(l1*25/216+l3*1408/2565+l4*2197/4101-l5/5);

  // Comparative solution
  let z=x+k1*16/135+k3*6656/12825+k4*28561/56430-k5*9/50+k5*2/55;

  // Step size
  if(Math.abs(z - x) > ERROR_TOLERANCE) {
    s = Math.pow(ERROR_TOLERANCE * h / (2 * Math.abs(z - x)), 1/4);
    h*=s;
  }

  return [x, v, h];
}

export function adamsBashforth2(f, t, x, v, h){
  //TODO
  return [x, v, h];
}

export function adamsBashforth4(f, t, x, v, h){
  //TODO
  return [x, v, h];
}
